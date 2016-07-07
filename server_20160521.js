var express = require("express");
var expressValidator = require('express-validator');
var apiItems = require('./routes/items');
var i18n = require('i18next');
var i18nFsBackend = require('i18next-node-fs-backend');
var i18nMiddleware = require('i18next-express-middleware');

var bodyParser = require('body-parser');
  
var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;



var itemModel = require('./db/item');
  
var app = express();
var router = express.Router({ mergeParams: true }); 

var path = __dirname + '/views/';


app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
 
app.use(express.static('public'));
app.use('/api', apiItems);

app.set('views', path);
app.set('view engine', 'ejs');

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }));


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


router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.get("/",function(req,res){
 console.log('用戶端語系：' + req.language);  

	res.sendFile(path + "index.html");

//res.render('index');
});

router.get("/about",function(req,res){
  res.sendFile(path + "about.html");
});

router.get("/contact",function(req,res){
  res.sendFile(path + "contact.html");
});

router.get("/itemshort",function(req,res){
  //res.sendFile(path + "itemshort.jade");
    res.render('itemshort');
});

router.get("/login",function(req,res){ 
    res.sendFile(path + "login.html");
});


router.get("/items/",function(req,res){ 
    itemModel.findAll().then(function(result) { 
         
        res.render('items.ejs', {items: result }); 
    }); 
});


router.get("/item/",function(req,res){ 
    result = itemModel;
    res.render('item.ejs', {item: result , formMethod: 'put' }); 
});


router.get("/item/:id/edit",function(req,res){    
    itemModel.find(req.params.id).then(function(result) { 
        res.render('item.ejs', {item: result ,   formMethod: (result&&result.id ? 'put' : 'post')}); 
    }); 
});


router.post("/item/:id/edit",function(req,res){  
    
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
        
         res.redirect("/item/"+req.params.id+"/edit");
    }); 
});


  

app.listen(3000,function(){
  console.log("Live at Port 3000");
});
