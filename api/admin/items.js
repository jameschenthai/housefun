var express = require('express');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');

var app = express();
var router = express.Router({ mergeParams: true }); 

var itemModel = require('../../model/item');
var itemUnitModel = require('../../model/itemUnit');
 
app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: false }));
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


router.get("/items/",function(req,res){ 
    var responseResult = 
    { 
        records:[],
        message: 'no data',
        count:0,
        status:'fail'
    };
    
    var userId=(req.user&&req.user.id)?req.user.id:null;
     console.log("---------userId:"+userId);
    
    if(userId){ 
        var query = new Object();
        query.userId=userId;
        query.page=req.query.page;
         
        itemModel.findAll(query).then(function(data) { 
            if(data){
                responseResult.message='ok';
                responseResult.status='succsess';
                responseResult.records=data.rows;
                responseResult.count=data.count;
            }  
            res.json(responseResult);
        });

         
    }else{
        res.json(responseResult);
    }

});
 


router.route('/admin/item/:id') 
.get(function(req, res) {
 
    itemModel.findWithUserId(req.params.id,req.user.id).then(function(item) {
        if(item){
            itemUnitModel.findAllByItemId(req.params.id).then(function(itemUnits) {
            
                res.json({
                    id: req.params.id,  
                    item:item?item:itemModel,
                    itemUnits:itemUnits,
                    message: 'The get api for item: ' + req.params.id
                })
             });
        }else{
            res.json({
                id: req.params.id,  
                item: itemModel,
                itemUnits: itemUnitModel,
                message: 'no data'
            })
        }
    });
    
})

router.route('/item/:id') 
.get(function(req, res) {
 
    itemModel.find(req.params.id).then(function(item) {
        if(item){
            itemUnitModel.findAllByItemId(req.params.id).then(function(itemUnits) {
            
                res.json({
                    id: req.params.id,  
                    item:item?item:itemModel,
                    itemUnits:itemUnits,
                    message: 'The get api for item: ' + req.params.id
                })
             });
        }else{
            res.json({
                id: req.params.id,  
                item: itemModel,
                itemUnits: itemUnitModel,
                message: 'no data'
            })
        }
    });
    
})
.post(function(req, res) { 
        var loginUserId = req.user.id ;
        var nameThai = req.body.nameThai ;
        var nameEnglish = req.body.nameEnglish ;
        var nameChinese = req.body.nameChinese ;
        var minPrice = req.body.minPrice ;
        var maxPrice = req.body.maxPrice ;
        var spaceSize = req.body.spaceSize ;
        var houseType = req.body.houseType ;
        var rentType = req.body.houseType ;
        var floor = req.body.floor ;
        var totalFloor = req.body.totalFloor ;
        var status = req.body.status ;
        //var updaterId = req.body.updaterId ;
     
  
    console.log('----------post:updaterId'+updaterId);
        itemModel.add(nameThai,nameEnglish,nameChinese,req.params.price,req.params.spaceSize,req.params.houseType,req.params.rentType,req.params.floor,req.params.totalFloor,loginUserId)
        .then(function() { 
            return itemModel.findByName(req.params.nameThai);
        }).then(function(item) {
            res.json({
                id: req.params.id,
                message: 'The post api for item: ' + req.params.id
            })
        });
    
    
})
.put(function(req,res){ 
    
//    req.checkBody({
//     'minPrice': {
//        notEmpty: true,
//        isInt: {
//          errorMessage: 'Invalid minPrice'
//        }
//      }
//    });
//    
//    var errors = req.validationErrors();
//    var mappedErrors = req.validationErrors(true);
//    
//   if (errors) { 
//        console.log(errors);
//       
//        res.send({ errors: errors }, 200);
//        return; 
//  } else {
//  

        var loginUserId = req.user.id ;
        var nameThai = req.body.nameThai ;
        var nameEnglish = req.body.nameEnglish ;
        var nameChinese = req.body.nameChinese ;
        var minPrice = req.body.minPrice ;
        var maxPrice = req.body.maxPrice ;
        var spaceSize = req.body.spaceSize ;
        var houseType = req.body.houseType ;
        var rentType = req.body.houseType ;
        var floor = req.body.floor ;
        var totalFloor = req.body.totalFloor ;
        var locationId = req.body.locationId ;
        var provinceId = req.body.provinceId ;
        var cityId = req.body.cityId ;
        var address = req.body.address ;
        var rentLimit = req.body.rentLimit ;
        var status = req.body.status ;
          
        var itemUnit_id = (req.body.itemUnit_id) ;
        var itemUnit_name = (req.body.itemUnit_name)   ;
        var itemUnit_monthlyMinPrice = (req.body.itemUnit_monthlyMinPrice)  ;
        var itemUnit_monthlyMaxPrice = (req.body.itemUnit_monthlyMaxPrice) ; 
        var itemUnit_dailyMinPrice = (req.body.itemUnit_dailyMinPrice)  ;
        var itemUnit_daillyMaxPrice = (req.body.itemUnit_daillyMaxPrice)  ;
        var itemUnit_spaceSize = (req.body.itemUnit_spaceSize) ;
        var itemUnit_houseType = (req.body.itemUnit_houseType) ;
        var itemUnit_roomQuantity = (req.body.itemUnit_roomQuantity)  ;
        var itemUnit_floor = (req.body.itemUnit_floor) ;
        var itemUnit_rentLimit = (req.body.itemUnit_rentLimit)  ;
        var itemUnit_status = (req.body.itemUnit_status)  ;
       
     console.log('----------------loginUserId'+loginUserId);
                 
          
        itemModel.update(req.params.id,nameThai,nameEnglish,nameChinese ,minPrice,maxPrice, spaceSize, houseType,rentType, floor, totalFloor,locationId,provinceId,cityId,address,rentLimit, status , loginUserId)
        .then(function(result) {
          
            var unitCount = itemUnit_name.length; 
              for(var j=0;j<unitCount;j++){
           
                  console.log('----------------itemUnit_roomQuantity'+itemUnit_roomQuantity[j]);
                  
                  
                  if(itemUnit_id[j]==null || itemUnit_id[j]==''){
                    itemUnitModel.add(req.params.id, itemUnit_name[j] ,itemUnit_monthlyMinPrice[j],itemUnit_monthlyMaxPrice[j],itemUnit_dailyMinPrice[j],itemUnit_daillyMaxPrice[j], itemUnit_spaceSize[j], itemUnit_houseType[j],itemUnit_roomQuantity[j], itemUnit_floor[j],itemUnit_rentLimit[j], loginUserId);
                }else{
                    itemUnitModel.update(itemUnit_id[j],req.params.id, itemUnit_name[j] ,itemUnit_monthlyMinPrice[j],itemUnit_monthlyMaxPrice[j],itemUnit_dailyMinPrice[j],itemUnit_daillyMaxPrice[j], itemUnit_spaceSize[j], itemUnit_houseType[j],itemUnit_roomQuantity[j], itemUnit_floor[j],itemUnit_rentLimit[j], itemUnit_status[j],loginUserId);
                }
              }
            
             res.json({
                    id: req.params.id, 
                    status: 200,
                    message: 'The get api for item: ' +  req.params.id
                });
            
             
        });
//  }
});



router.route('/place/:provinceId')
.get(function(req, res) {
 
    itemModel.findByProvinceId(req.params.provinceId).then(function(result) {
        if(result){
            res.json({
                id: req.params.provinceId, 
                items:result,
                message: 'The get api for item: ' + req.params.provinceId
            })
        }else{
            res.json({
                id: req.params.id,
                message: 'no data'
            })
        }
    });
})

router.route('/place/:provinceId/:cityId')
.get(function(req, res) {
 
    itemModel.findByCityId(req.params.cityId).then(function(result) {
        if(result){
            res.json({
                id: req.params.cityId, 
                items:result,
                message: 'The get api for item: ' + req.params.cityId
            })
        }else{
            res.json({
                id: req.params.id,
                message: 'no data'
            })
        }
    });
})

module.exports = router;
