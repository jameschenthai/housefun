var express = require('express');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var cookie = require('cookie');

var app = express();
var router = express.Router({ mergeParams: true }); 

var location = require('../model/location');
 
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

 

router.route('/locations/:typeId') 
.get(function(req, res) {
    var responseResult = {
        id: req.params.typeId,
        records:null,
        message: 'no data',
        status:'fail'
    }
     
    var cookies = cookie.parse(req.headers.cookie || ''); 
    var cookie_lng = cookies.i18next;
     
    if(req.params.typeId){
        var query = new Object();
        query.typeId=req.params.typeId;
        query.lng=cookie_lng;
        
        location.findAll(query).then(function(result) {
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
    

module.exports = router;
