var express = require('express');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');

var app = express();
var router = express.Router({ mergeParams: true }); 

var globalProvince = require('../../model/globalProvince');
 
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
   
    globalProvince.findAll(req.params.provinceId).then(function(result) {
        if(result){
            res.json({
                id: req.params.provinceId,  
                status: 'success',
                globalProvinces:result
            })
        }else{
            res.json({
                id: req.params.provinceId,
                status: 'fail',
                globalProvinces:null,
                message: 'no data'
            })
        }
    });
    
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
