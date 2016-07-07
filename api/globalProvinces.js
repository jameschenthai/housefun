var express = require('express');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var cookie = require('cookie');

var app = express();
var router = express.Router({ mergeParams: true }); 

var globalProvince = require('../model/globalProvince');
 
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

 

router.route('/globalProvinces/:provinceId') 
.get(function(req, res) {
    var responseResult = {
        id: req.params.countryId,
        records:null,
        message: 'no data',
        status:'fail'
    }
     
    var cookies = cookie.parse(req.headers.cookie || ''); 
    var cookie_lng = cookies.i18next;
  
    if(req.params.provinceId){
        var query = new Object();
        query.provinceId=req.params.provinceId;
        query.lng=cookie_lng;
        
        globalProvince.findAll(query).then(function(result) {
            if(result){
                responseResult.records=result;
                responseResult.status='success';
            }else{  
                responseResult.status='success';
            }
            
            message: '',
             res.json(responseResult);
        });
    }else{
        res.json(responseResult);
    }
    
    
}) 
    
router.route('/globalProvinces/city/:cityId') 
.get(function(req, res) {
   
    globalProvince.findByCityId(req.params.cityId).then(function(result) {
        if(result){
            res.json({
                id: req.params.cityId,  
                status: 'success',
                globalProvinces:result
            })
        }else{
            res.json({
                id: req.params.cityId,
                status: 'fail',
                globalProvinces:null,
                message: 'no data'
            })
        }
    });
    
}) 

module.exports = router;
