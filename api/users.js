var express = require('express');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var request = require('request');
var aws = require('aws-sdk');


var i18next = require('i18next')
  , i18nFsBackend = require('i18next-node-fs-backend')
  , i18nMiddleware = require('i18next-express-middleware');

var user = require('../model/user');

var app = express();
var router = express.Router({ mergeParams: true }); 


var api_domain = 'http://localhost:3000';
var web_domain = 'http://www.housefun.asia/';
 
aws.config.loadFromPath('./conf/aws.json');

var ses = new aws.SES({apiVersion: '2010-12-01'});

app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
  
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));


var i18next_options = {
                        fallbackLng: "en",
                        lowerCaseLng: true,
                        useCookie: true,
                        cookieName: 'lng',
                        backend: {
                            loadPath: "locales/{{lng}}/translation.json",
                        }
                    };

// i18next 初始設定
i18next.use(i18nMiddleware.LanguageDetector) // 自動偵測用戶端語系
     .use(i18nFsBackend)
     .init( i18next_options);
    app.use(i18nMiddleware.handle(i18next, {
}));

router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

 
router.get("/users/checkemail/:email",function(req,res){  
   var email = req.params.email;
    if(email!=null&&email!=''){
          user.isEmailExist(email)
            .then(function(result) {
                res.json({ 
                        exist: (result&&result.email!=null&&result.email!='')?'1':'0',
                        code:'200'
                });
            });  
    }else{
        res.json({ 
            exist: '0',
            code:'404'
        });
    }

});

 
router.get("/search/users/",function(req,res){ 
    user.findAll()
    .then(function(result) {
           res.json({
                date:result ,
                message: 'The post api for item: ' + req.params.id
            })
    });
});

router.post("/users/foregetpassword",function(req,res){ 
    var email = req.body.email ;
    
    if(email&&email!=''){
        user.findByEmail(email)
            .then(function(result) {
                    if(result&&result.password){
                        
                        console.log('------result.password:'+result.password);
                        result.password=user.decodingPassword(result.password);
                        
                        console.log('------result.password after:'+result.password);
                        
                        
                        sendForgetPasswordEmail(result.email,result.password);
                        
                         res.json({
                            code:'200' ,
                            massage:i18next.t('msg.email.send_forget_password')
                        })
                    }else{
                         res.json({
                            code:'200' ,
                            massage:i18next.t('msg.email.not_exist')
                        })
                    }
                  
            }); 
    }else{
        res.json({
            code:'200' ,
            massage:i18next.t('msg.email.not_exist')
        })
    }
});

router.get("/users/emailvalidate",function(req,res){ 
    var email = req.query.email ;
    var emailConfirmCode = req.query.code ;
   
    if(email&&email!=''&&emailConfirmCode&&emailConfirmCode!=''){
        user.updateEmailVaildate(email,emailConfirmCode)
            .then(function(result) {
                   res.json({
                        code:'200' ,
                        emailvalidateStatus:result
                    })
            }); 
    }
});    
    
router.post("/users/signup/",function(req,res){  
    var userName = req.body.userName ;
    var email = req.body.email ;
    var password = req.body.password ;
    var confirmPassword = req.body.confirmPassword ;
    var useFb = '' ;
    var isMerchant = '' ; 
    var createrId = '' ;
     
    if(userName!=''&&email!=''&&password!=''&&password==confirmPassword){
       
        request(api_domain+'/api/users/checkemail/'+email, function (error, response, body) {
              var apiResult = (!error && response.statusCode == 200) ? JSON.parse(body) : new Object();
            
           if(apiResult.exist&&apiResult.exist=='0'){
               
               user.add(userName ,email,password, useFb, isMerchant, createrId)
                    .then(function(result) {
                       
                        //sned eamil
 
                        sendRegiestEmail(result.email,result.emailConfirmCode);
                    
                         res.json({
                                result:result,
                                message: i18next.t('msg.singup.success')
                            })
                    });  
           }else{
               res.json({
                    message: i18next.t('msg.singup.fail_02')
                })
           }
        });  

        
      
    }else{
         res.json({
                   message: i18next.t('msg.singup.fail_01')
                })
    }
    
});


router.route('/user/:id') 
.get(function(req, res) {
 
    item.find(req.params.id).then(function(item) {
        if(item){
            res.json({
                id: req.params.id,  
                message: 'The get api for item: ' + req.params.id
            })
        }else{
            res.json({
                id: req.params.id,
                message: 'no data'
            })
        }
    });
    
})
.put(function(req, res) { 
    var name = req.body.name ;
    var email = req.body.email ;
    var password = req.body.password ;
    var useFb = req.body.useFb ;
    var isMerchant = req.body.isMerchant ; 
    var createId = req.body.createId ;
    item.add(id,name ,email,password, useFb, isMerchant, status , updaterId)
        .then(function() { 
            return item.findByEmail(req.params.email);
        }).then(function(user) {
            res.json({
                id: req.params.id,
                message: 'The post api for item: ' + req.params.id
            })
        });
    
    
})
  
.delete(function(req, res) {
    res.json({
        id: req.params.id,
        message: 'The delete api for image: ' + req.params.id
    })
});

  
var sendRegiestEmail=function(toAddresses,emailConfirmCode){
    if(toAddresses&&toAddresses!=''&&emailConfirmCode&&emailConfirmCode!=''){
        
        var source= "jameschenthai@gmail.com";
        var replyToAddresses= ["jameschenthai@gmail.com"];
        var returnPath= "jameschenthai@gmail.com";
        //var ToAddresses = toAddresses;
        var toAddresses = ["jameschenthai@gmail.com"];
        
        var emailvalidatStr = web_domain+"users/emailvalidate/?email="+toAddresses+"&code="+emailConfirmCode;
         

        var subject = i18next.t('email.singup.subject');
        subject="[TEST]"+subject;
            
        var content = i18next.t('email.singup.content');
        content = content.replace(/#emailvalidatUrl#/g, emailvalidatStr);
        
        var eparam = {
            Destination: {
              ToAddresses: toAddresses
            },
            Message: {
                Subject: {
                    Data: subject
                },
                Body: {
                    Html: {
                    Data: content
                    } 
                }
            },
            Source: source,
            ReplyToAddresses: replyToAddresses,
            ReturnPath: returnPath
        };

        ses.sendEmail(eparam, function (err, data) {
          if (err) console.log(err);
          else console.log(data);
        });
    }
}




var sendForgetPasswordEmail=function(toAddresses,password){
    if(toAddresses&&toAddresses!=''&&password&&password!=''){
        var source= "jameschenthai@gmail.com";
        var replyToAddresses= ["jameschenthai@gmail.com"];
        var returnPath= "jameschenthai@gmail.com";
        //var ToAddresses = toAddresses;
        var toAddresses = ["jameschenthai@gmail.com"];
        
        var subject = i18next.t('email.forgetPassword.subject');
        subject="[TEST]"+subject;
             
        var content = i18next.t('email.forgetPassword.content');
        content = content.replace(/#password#/g, password);
        
        var eparam = {
            Destination: {
              ToAddresses: toAddresses
            },
            Message: {
                Subject: {
                    Data: subject
                },
                Body: {
                    Html: {
                    Data: content
                    } 
                }
            },
            Source: source,
            ReplyToAddresses: replyToAddresses,
            ReturnPath: returnPath
        };

        ses.sendEmail(eparam, function (err, data) {
          if (err) console.log(err);
          else console.log(data);
        });
    }
}

module.exports = router;
