var express = require("express");
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var session = require('express-session');

var app = express();
var router = express.Router({ mergeParams: true }); 


var i18n = require('i18next')
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
var itemsAPI = require('./api/items');
var usersAPI = require('./api/users');

  
app.use(express.static('public'));
app.use(express.static('views'));


app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 

 
//app.use(cookieParser);
app.use(session({secret: 'blog.fens.me', cookie: { maxAge: 60000 }}));
app.use(passport.initialize());
app.use(passport.session());
 

app.use('/api', itemsAPI);
app.use('/api', usersAPI);

app.set('views', path);
app.set('view engine', 'ejs');

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }));

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
 console.log('用戶端語系：' + req.language);  

	res.sendFile(path + "base/index.html");

//res.render('index');
});

router.get("/about",function(req,res){
  res.sendFile(path + "base/about.html");
});

router.get("/contact",function(req,res){
  res.sendFile(path + "base/contact.html");
});

router.get("/itemshort",function(req,res){
  //res.sendFile(path + "itemshort.jade");
    res.render('itemshort');
});



router.get("/upload",function(req,res){ 
    res.sendFile(path + "upload.html");
});


router.get("/login",function(req,res,next){
     res.render('base/login.ejs',{msg:''});  
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
            
            console.log('check user:----'+user);
            
                if(!user){
                    return res.redirect('/login');
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




app.all('/about', isLoggedIn); 

app.get('/logout', function (req, res) {
     console.log('----logout');
    req.logout();
    res.redirect('/');
});



function isLoggedIn(req, res, next) { 
 
    console.log('----req.isAuthenticated():'+req.isAuthenticated());
    console.log('----req.user:'+req.user);
    
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
                    
                    console.log('----logIn');
                    
                    //var redirect = req.param('redirect') || '/';
                    //res.redirect(redirect);
                });
            }
        )(req, res, next);
    }
 
//item
router.get("/item/:id/",function(req,res){    
    itemModel.find(req.params.id).then(function(result) { 
        res.render('/item/item.ejs', {item: result ,   formMethod: (result&&result.id ? 'put' : 'post')}); 
    }); 
});


app.get('/api/users/me',
  passport.authenticate('basic', { session: false }),
  function(req, res) {
    res.json({ id: req.user.id, username: req.user.username });
  });

//------------Admin----------------start
 



router.get("/admin/items/",function(req,res){ 
     
    itemModel.findAll().then(function(result) {  
        res.render('admin/items.ejs', {items: result }); 
    }); 
});

 

app.all('/admin/*/*', isLoggedIn); 

router.get("/admin/item/:id/edit",function(req,res){    
//    itemModel.find(req.params.id).then(function(result) { 
//        res.render('admin/item.ejs', {item: result ,   formMethod: (result&&result.id ? 'put' : 'post')}); 
//    }); 
//    
    
     res.render('admin/item.ejs',{id: req.params.id} ); 
    
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
    var updaterId = req.body.updaterId ;
    
    
    itemModel.update(req.params.id,req.body.name ,req.body.price, spaceSize, houseType,rentType, floor, totalFloor, status , updaterId)
    .then(function(result) {
        
         res.redirect("/admin/item/"+req.params.id+"/edit");
    }); 
});


var AWS_ACCESS_KEY = '"AKIAJHZISSWSBHK3YR5Q"';
var AWS_SECRET_KEY = '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';
var S3_BUCKET ='elasticbeanstalk-us-west-2-618947447952';

var storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, '/public/uploads');
  },
  filename: function (request, file, callback) {
    console.log(file);
    callback(null, file.originalname)
  }
});


var upload = multer({storage: storage}).single('photo');



router.post('/upload/file', function(req, res){
    aws.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});
    var s3 = new aws.S3();
    var s3_params = {
        Bucket: S3_BUCKET,
        Key: req.query.file_name,
        Expires: 60,
        ContentType: req.query.file_type,
        ACL: 'public-read'
    };
    

     upload(req, res, function(err) {
          
        var path = req.file.image.path;

        fs.readFile(path, function(err, file_buffer){
            var params = {
                Bucket: S3_BUCKET,
                Key:  req.query.file_name,
                Body: file_buffer,
                Expires: 60,
                ContentType: req.query.file_type,
                ACL: 'public-read'
            };

            console.log("-------start uplad file to s3");
            s3.putObject(params, function (perr, pres) {
                if (perr) {
                    console.log("Error uploading data: ", perr);
                } else {
                    console.log("Successfully uploaded data to myBucket/myKey");
                }
            });
        });


      if(err) {
        console.log('Error Occured');
        return;
      }
      console.log(req.file);
      response.end('Your File Uploaded');
      console.log('Photo Uploaded');
     })
     


    
    
});





// i18next 初始設定
 i18n.use(i18nMiddleware.LanguageDetector) // 自動偵測用戶端語系
    .use(i18nFsBackend)
    .init({
            fallbackLng: "en", // 備用語系，擷取失敗時會使用到這裡
            backend: {
                loadPath: "locales/{{lng}}/translation.json",
            }
        });

    app.use(i18nMiddleware.handle(i18n, {

}));



passport.use(new LocalStrategy(
  function(username, password, done) {
  
    userModel.findByName(username).then(function (user) {
         console.log('---------user:'+user);
      
      if (!user) {
          console.log('!user');
          return done(null, false, { message: 'Incorrect username.' });
      }
        
      if (!userModel.validPassword(user,password)) {
          console.log('!password');
          return done(null, false, { message: 'Incorrect password.' });
      }
        
      return done(null, user);
    });
       
  }
));


passport.use(new FacebookStrategy({
    clientID: 1105356746172914,
    clientSecret: '28db6aeda39dbdcde38da3c64f28c4e5',
    callbackURL: 'http://www.pchome.com.tw/auth/facebook/callback'
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
 
  
  
app.use("/",router);

app.use("*",function(req,res){
  res.sendFile(path + "./base/404.html");
});


app.listen(3000,function(){
  console.log("Live at Port 3000");
});
