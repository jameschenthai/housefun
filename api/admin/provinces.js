var express = require('express');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');

var app = express();
var router = express.Router({ mergeParams: true }); 

var province = require('../../model/province');
 
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

 

router.route('/provinces/:countryId') 
.get(function(req, res) {
 
    console.log(req.params.countryId);
    
    province.findAll(req.params.countryId).then(function(result) {
        if(result){
            res.json({
                id: req.params.countryId,  
                status: 'success',
                provinces:result
            })
        }else{
            res.json({
                id: req.params.countryId,
                provinces:null,
                message: 'no data'
            })
        }
    });
    
}) 
    

module.exports = router;
