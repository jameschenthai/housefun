var express = require('express');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var cookie = require('cookie');

var app = express();
var router = express.Router({ mergeParams: true }); 

var itemModel = require('../model/item');
var itemUnitModel = require('../model/itemUnit');
 
app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 
 
 var defaultQueryParams = new Object();
 defaultQueryParams.limit = 2;

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
    var responseResult = {
        records:null,
        message: 'no data',
        status:'fail',
        count:0,
        pageCount:0
    }
    
    var cookies = cookie.parse(req.headers.cookie || ''); 
    var cookie_lng = cookies.i18next;
      
    var query = new Object();
        query.lng=cookie_lng;

    if(req.query.page!=null&&req.query.page!=''){
        query.page=req.query.page;
    }
    
    if(req.query.userId!=null&&req.query.userId!=''){
        query.createrId=req.query.userId;
    }
    
    if(req.query.provinceId!=null&&req.query.provinceId!=''){
        query.provinceId=req.query.provinceId;
    }

    if(req.query.cityId!=null&&req.query.cityId!=''){
        query.cityId=req.query.cityId;
    }

    if(req.query.locationId!=null&&req.query.locationId!=''){
        query.locationId=req.query.locationId;
    }
    
    if(req.query.houseType!=null&&req.query.houseType!=''){
        query.houseType=req.query.houseType;
    }
    
    if(req.query.keyword!=null&&req.query.keyword!=''){
        query.keyword=req.query.keyword;
    }      

    if(req.query.minPrice!=null&&req.query.minPrice!=''){
        query.minPrice=req.query.minPrice;
    }     
    
    if(req.query.maxPrice!=null&&req.query.maxPrice!=''){
        query.maxPrice=req.query.maxPrice;
    }
    
     
    
    query.limit=defaultQueryParams.limit;
         

    itemModel.findAll(query).then(function(data) {
        if(data){
            responseResult.message='ok';
            responseResult.status='succsess';
            responseResult.records=data.rows;
            responseResult.count=data.count;
            responseResult.pageCount=Math.floor(data.count/defaultQueryParams.limit);
        }else{  
            responseResult.status='success';
        }
 
        res.json(responseResult);
    }); 
      
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
