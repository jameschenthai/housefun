var express = require("express");
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
//var cookieParser = require('cookie-parser')
var cookie = require('cookie');
var session = require('express-session');
var request = require('request');

var app = express();
var router = express.Router({ mergeParams: true }); 


var i18next = require('i18next')
  , i18nFsBackend = require('i18next-node-fs-backend')
  , i18nMiddleware = require('i18next-express-middleware');

  
var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy 
  , LocalStrategy = require('passport-local').Strategy;

var multer = require('multer');
var fs = require('fs');

var aws = require('aws-sdk');
 
var path = __dirname + '/views/';

var itemModel = require('./model/item');
var userModel = require('./model/user'); 
var locationModel = require('./model/location'); 

var api_domain = 'http://localhost:3000';

//admin
var itemsAPI_admin = require('./api/admin/items');
var usersAPI_admin = require('./api/admin/users');
var provincesAPI_admin = require('./api/admin/provinces');
var globalProvincesAPI_admin = require('./api/admin/globalProvinces');
var locationsAPI_admin = require('./api/admin/locations');


//client
var itemsAPI = require('./api/items');
var usersAPI = require('./api/users');
var provincesAPI = require('./api/provinces');
var globalProvincesAPI = require('./api/globalProvinces');
var locationsAPI = require('./api/locations');
var searchAPI = require('./api/search');

app.use(express.static('public'));
app.use(express.static('views'));


app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 

 

app.use(session({secret: 'thai.james.555.taiwan.2016.06.20.rent', cookie: { maxAge: 60*1000*10 }}));
app.use(passport.initialize());
app.use(passport.session());
 
//app.use(cookieParser);

//admin
app.use('/api/admin', itemsAPI_admin);
app.use('/api/admin', usersAPI_admin);
app.use('/api/admin', provincesAPI_admin);
app.use('/api/admin', globalProvincesAPI_admin);
app.use('/api/admin', locationsAPI_admin);

//client
app.use('/api', itemsAPI);
app.use('/api', usersAPI);
app.use('/api', provincesAPI);
app.use('/api', globalProvincesAPI);
app.use('/api', locationsAPI);
app.use('/api', searchAPI);


app.set('views', path);
app.set('view engine', 'ejs');

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }));


aws.config.loadFromPath('./conf/aws.json');


var uploading = multer({
  dest: __dirname + '/public/uploads/',
  limits: {fileSize: 1000000, files:1},
})

 

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

router.get("/",function(req,res){  
	res.render(path + "base/index");

});

router.get("/language",function(req,res){
    
     console.log('------------------------------------/language :'+req.query.lng);
  
    
    if(req.query&&req.query.lng){ 
        res.setHeader('Set-Cookie', cookie.serialize('i18next', String(req.query.lng), {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 7 // 1 week 
        })); 
    }
     
   //res.render(path + "base/index");
   res.send("success");
});

router.get("/search",function(req,res){
    request(api_domain+'/api/search/', function (error, response, body) {
        var result = (!error && response.statusCode == 200) ? JSON.parse(body) : new Object();
        res.render(path + "base/search",result); 
    });  
});

router.get("/bts",function(req,res){
       res.render(path + "base/bts"); 
});


router.get("/about",function(req,res){
  res.render(path + "base/about");
});

router.get("/contact",function(req,res){
  res.render(path + "base/contact");
});

router.get("/itemshort",function(req,res){
  //res.sendFile(path + "itemshort.jade");
    res.render('itemshort');
});



router.get("/upload",function(req,res){ 
    res.render(path + "upload");
});

 
router.get("/signup",function(req,res,next){  
     res.render(path + "base/signup"); 
});


router.get("/forgetpassword",function(req,res,next){  
     res.render(path + "base/forgetpassword");  
});

router.get("/users/emailvalidate",function(req,res,next){  
    var email = req.query.email ;
    var emailConfirmCode = req.query.code ;
   
    if(email&&email!=''&&emailConfirmCode&&emailConfirmCode!=''){
        request(api_domain+'/api/users/emailvalidate?email='+email+'&code='+emailConfirmCode, function (error, response, body) {
            var result = (!error && response.statusCode == 200) ? JSON.parse(body) : new Object();
            
            res.render(path + 'base/emailvalidate',result); 
        }); 
    }
});



router.get("/login",function(req,res,next){ 
     res.render('base/login',{msg:req.query.msg=='error'?i18next.t('msg.login.fail_01'):''});  
});
 
router.post('/login',  function(req, res, next){
        passport.authenticate('local', {
            successRedirect: '/login?msg=success',
            failureRedirect: '/login?msg=error',
            session: true
        }, function(err, user, info){
                if(err){
                    return next(err);
                }
            
                if(!user){
                    return res.redirect('/login?msg=error');
                }
            
                req.logIn(user, function(err){
                    if (req.body.rememberme) {
                        req.session.cookie.maxAge = 30*24*60*60*1000 ;//Rememeber 'me' for 30 days
                    } else {
                        req.session.cookie.expires = false;
                    }
                    var redirect = req.param('redirect') || '/';
                    res.redirect(redirect);
                });
            }
        )(req, res, next);
    }
);



app.get('/logout', function (req, res) {
     console.log('----logout');
    req.logout();
    req.session.destroy();
    res.redirect('/login');
});



function isLoggedIn(req, res, next) { 
 
        passport.authenticate('local', {
            successRedirect: '/login?msg=success',
            failureRedirect: '/login?msg=error',
            session: true
        }, function(err, user, info){
                if(err){
                    return next(err);
                } 
            
                if(!req.isAuthenticated() || !req.user){
                    return res.redirect('/login');
                }else{
                    return next();
                }
            
                req.logIn(user, function(err){
                    if (req.body.rememberme) {
                        req.session.cookie.maxAge = 30*24*60*60*1000 ;//Rememeber 'me' for 30 days
                    } else {
                        req.session.cookie.expires = false;
                    }
                    
                    //var redirect = req.param('redirect') || '/';
                    //res.redirect(redirect);
                });
            }
        )(req, res, next);
    }
 
//item
router.get("/items/",function(req,res){
    request(api_domain+'/api/items/', function (error, response, body) {
        var result = (!error && response.statusCode == 200) ? JSON.parse(body) : new Object();
        res.render('item/items.ejs',result); 
    });    
});


router.get("/item/:id/",function(req,res){    
    if(req.params.id){
        request(api_domain+'/api/item/'+req.params.id, function (error, response, body) {
            var result = (!error && response.statusCode == 200) ? JSON.parse(body) : new Object();
            console.log(result);
            res.render('item/item.ejs',result); 
        });
    }else{
        res.render('item/item.ejs',{record: []}); 
    }
});

 

//------------Admin----------------start
router.get("/admin/profile",function(req,res){ 
     res.render('admin/profile/profile.ejs'); 
});


router.get("/admin/",function(req,res){ 
     res.render('admin/item/items.ejs'); 
});


router.get("/admin/items/",function(req,res){
     res.render('admin/item/items.ejs'); 
    
//    var userId = (req.user&&req.user.id) ? req.user.id : null;  
//    request.post(api_domain+'/api/admin/items/', {form:{userId:userId}}, function (error, response, body) {
//        console.log(body);
//        
//        var result = (!error && response.statusCode == 200) ? JSON.parse(body) : new Object();
//        res.render('admin/item/items.ejs',result); 
//    });        
});

 
router.get("/admin/item/:id/edit",function(req,res){
     res.render('admin/item/item.ejs',{id: req.params.id} ); 
});


router.post("/admin/item/:id/edit",function(req,res){  
    
    req.checkBody({
     'price': {
        notEmpty: true,
        isInt: {
          errorMessage: 'Invalid Email'
        }
      }
    });
    
    var errors = req.validationErrors();
    var mappedErrors = req.validationErrors(true);
   if (errors) { 
    res.send({ errors: errors }, 200);
    return;
  
  } else {
    // normal processing here
  }
    var name = req.body.name ;
    var price = req.body.price ;
    var spaceSize = req.body.spaceSize ;
    var houseType = req.body.houseType ;
    var rentType = req.body.houseType ;
    var floor = req.body.floor ;
    var totalFloor = req.body.totalFloor ;
    var status = req.body.status ;
    var updaterId = req.user.id ;
    
    console.log('-------------------------------updaterId:'+updaterId);
    
    itemModel.update(req.params.id,req.body.name ,req.body.price, spaceSize, houseType,rentType, floor, totalFloor, status , updaterId)
    .then(function(result) {
        
         res.redirect("/admin/item/"+req.params.id+"/edit");
    }); 
});

app.all('/admin/*', isLoggedIn); 
app.all('/admin/*/*', isLoggedIn); 
app.all('/api/admin/*', isLoggedIn); 
 
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './upload');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
});

var upload = multer({ storage : storage }).array('userPhoto',2);
 

router.post('/upload/file', function(req, res){
//    aws.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});
//    var s3 = new aws.S3();
//    var s3_params = {
//        Bucket: S3_BUCKET,
//        Key: req.query.file_name,
//        Expires: 60,
//        ContentType: req.query.file_type,
//        ACL: 'public-read'
//    };
    

//     upload(req, res, function(err) {
//          
//        //var path = req.file.photo.path;
//
//          console.log("-------req:"+req);
//         console.log("-------req:"+req.body.file);
//         
//        for(var obj in req){
//            console.log("-------obj in req:"+obj);
//        }
//         
//         
//        fs.readFile(path, function(err, file_buffer){
//            var params = {
//                Bucket: S3_BUCKET,
//                Key:  req.query.file_name,
//                Body: file_buffer,
//                Expires: 60,
//                ContentType: req.query.file_type,
//                ACL: 'public-read'
//            };
//
//            console.log("-------start uplad file to s3");
//            s3.putObject(params, function (perr, pres) {
//                if (perr) {
//                    console.log("Error uploading data: ", perr);
//                } else {
//                    console.log("Successfully uploaded data to myBucket/myKey");
//                }
//            });
//        });
//
//
//      if(err) {
//        console.log('Error Occured');
//        return;
//      }
//      console.log(req.file);
//      response.end('Your File Uploaded');
//      console.log('Photo Uploaded');
//     })
//     

    var tmp_path = req.file;

  /** The original name of the uploaded file
      stored in the variable "originalname". **/
  //var target_path = 'uploads/' + req.file.originalname;
 
 upload(req,res,function(err) {
        console.log(req.body);
        console.log(req.files);
        if(err) {
            return res.end("Error uploading file."+err);
        }
        res.end("File is uploaded");
    });   
    
});




//email

router.get("/sendemail",function(req,res){

    var ses = new aws.SES({apiVersion: '2010-12-01'});
  
    var eparam = {
        Destination: {
          ToAddresses: ["jameschenthai@gmail.com"]
        },
        Message: {
          Body: {
            Html: {
              Data: "<p>Hello, this is a test email!</p>"
            },
            Text: {
              Data: "Hello, this is a test email!"
            }
          },
          Subject: {
            Data: "SES email test"
          }
        },
        Source: "jameschenthai@gmail.com",
        ReplyToAddresses: ["jameschenthai@gmail.com"],
        ReturnPath: "jameschenthai@gmail.com"
    };

    ses.sendEmail(eparam, function (err, data) {
      if (err) console.log('------error:'+err);
      else console.log('---success,data:'+data);
    });
    
    
});


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
 

passport.use(new LocalStrategy(
  function(email, password, done) {
 
    userModel.findByEmail(email).then(function (user) {
      if (!user || !userModel.validPassword(password)) {
          return done(null, false, { message: i18next.t('msg.login.fail_01') });
      }
        
      return done(null, user);
    });
       
  }
));


passport.use(new FacebookStrategy({
    clientID: 1105356746172914,
    clientSecret: '28db6aeda39dbdcde38da3c64f28c4e5',
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
}, function(accessToken, refreshToken, profile, done) {
    
    console.log("accessToken------------"+accessToken);
    console.log("refreshToken------------"+refreshToken);
    console.log("profile------------"+profile);
    
    //User.findOrCreate(..., function (err, user) {
    //    if (err) { return done(err); }
    //    done(null, user);
    //});
  }
));


passport.serializeUser(function (user, done) {
    done(null, user);
});

 passport.deserializeUser(function (user, done) {
    done(null, user);
});
 

app.use(function(req, res, next) {
  //res.locals.user = req.session.user;
    res.locals.user = req.user;
  next();
});
  
app.use("/",router);

app.use("*",function(req,res){
  res.sendFile(path + "./base/404.html");
});


app.listen(3000,function(){
  console.log("Live at Port 3000");
});
