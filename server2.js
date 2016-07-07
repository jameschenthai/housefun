var express = require("express");
var i18n = require('i18next');
var i18nFsBackend = require('i18next-node-fs-backend');
var i18nMiddleware = require('i18next-express-middleware');

var app = express();
var router = express.Router();
var path = __dirname + '/views/';

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


router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.get("/",function(req,res){
 console.log('用戶端語系：' + req.language);  

res.sendFile(path + "index.html");
});

router.get("/about",function(req,res){
  res.sendFile(path + "about.html");
});

router.get("/contact",function(req,res){
  res.sendFile(path + "contact.html");
});

app.use("/",router);

app.use("*",function(req,res){
  res.sendFile(path + "404.html");
});

app.listen(3000,function(){
  console.log("Live at Port 3000");
});
