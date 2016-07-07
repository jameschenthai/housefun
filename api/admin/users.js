var express = require('express');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var cookie = require('cookie');

var user = require('../../model/user');

var app = express();
var router = express.Router({ mergeParams: true }); 

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


router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});



router.get("/search/user/:email",function(req,res){ 
   var email = req.params.email;
   var attributes =['email','status'];
    user.findByEmail(email,attributes)
    .then(function(result) {
        var result = result?result:user;
        
        res.json({
            id: req.params.id,  
            message: 'The get api for item: ' + req.params.id,
            user:result
        });
         
    });
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


router.post("/user/",function(req,res){ 
   
    var name = req.body.name ;
    var email = req.body.email ;
    var password = req.body.password ;
    var useFb = req.body.useFb ;
    var isMerchant = req.body.isMerchant ; 
    var createId = req.body.createId ;

    user.add(name ,email,password, useFb, isMerchant, ceaterId)
    .then(function(result) {
         res.redirect("/user/"+result.id+"/edit");
    });
});


router.route('/user/') 
.get(function(req, res) {
     var responseResult = {
        record:null,
        message: 'no data',
        status:'fail' 
    }
     
     console.log('-------/user:'+req.user.id);
    
    user.find(req.user.id).then(function(data) {
        if(data){
            responseResult.status='succsess';
            responseResult.message='ok';
            responseResult.record=data; 
        }else{  
            responseResult.status='success';
        }
 
        res.json(responseResult);
    });
    
})
.post(function(req, res) { 
    var name = req.body.name ;
    var password = req.body.password ;
    user.add(id,name ,email,password, useFb, isMerchant, status , updaterId)
        .then(function() { 
            return item.findByEmail(req.params.email);
        }).then(function(user) {
            res.json({
                id: req.params.id,
                message: 'The post api for item: ' + req.params.id
            })
        });
    
    
})
.put(function(req, res) { 
    var name = req.body.name ;
    var password = req.body.password ;
    var confirmPassword = req.body.confirmPassword ;
    
    if(password==confirmPassword){
           user.update(req.user.id,name ,password, req.user.id)
        .then(function() {  
            res.json({ 
                message: 'Update Success' 
            })
        });
    }else{
         res.json({ 
                message: 'Update Faile' 
            })
    }
 
    
    
})  
.delete(function(req, res) {
    res.json({
        id: req.params.id,
        message: 'The delete api for image: ' + req.params.id
    })
});

  

module.exports = router;
