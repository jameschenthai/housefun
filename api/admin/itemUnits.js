var express = require('express');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');

var app = express();
var router = express.Router({ mergeParams: true }); 

var itemUnit = require('../../model/itemUnit');
 
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


router.put("/itemUnit/:id",function(req,res){ 
    
    var errors = req.validationErrors();
    var mappedErrors = req.validationErrors(true);
    
   if (errors) { 
        console.log(errors); 
        res.send({ errors: errors }, 200);
        return; 
  } else {
        var id = req.body.id ;
        var itemId = req.body.itemId ;
        var name = req.body.name ;
      
        var monthlyMinPrice = req.body.monthlyMinPrice ;
        var monthlyMaxPrice = req.body.monthlyMaxPrice ;
        var dailyMinPrice = req.body.dailyMinPrice ;
        var daillyMaxPrice = req.body.daillyMaxPrice ;
        var spaceSize = req.body.spaceSize ;
        var houseType = req.body.houseType ;
        var roomQuantity = req.body.roomQuantity ;
        var floor = req.body.floor ;
        var rentLimit = req.body.rentLimit ;
        var status = req.body.status ;
      
     
        var updaterId = req.body.updaterId ;

 

        itemUnit.update(id,itemId, name,monthlyMinPrice,monthlyMaxPrice,dailyMinPrice,daillyMaxPrice, spaceSize, houseType,roomQuantity , floor,rentLimit, status , updaterId)
        .then(function(result) {

             res.redirect("/item/"+req.params.id+"/edit");
        });
  }
});


 

router.route('/itemUnits/:unitId') 
.get(function(req, res) {
 
    itemUnit.findAllByItemId(req.params.unitId).then(function(itemList) {
        if(itemList){
            res.json({
                id: req.params.unitId,  
                message: 'The get api for itemUnit: ' + req.params.unitId
            })
        }else{
            res.json({
                id: req.params.itemUnit,
                message: 'no data'
            })
        }
    });
    
})
.put(function(req, res) { 
        item.add(req.params.name,req.params.price,req.params.spaceSize,req.params.houseType,req.params.rentType,req.params.floor,req.params.totalFloor,'james' )
        .then(function() { 
            return item.findByName(req.params.name);
        }).then(function(item) {
            res.json({
                id: req.params.id,
                message: 'The post api for item: ' + req.params.id
            })
        });
    
    
})
    

module.exports = router;
