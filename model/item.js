var Sequelize = require('sequelize');
var sequelize = require('../conf/db');

 var defaultQueryParams = new Object();
 defaultQueryParams.limit = 2;
 defaultQueryParams.offset = 0;
 
var default_lng='name_thai';

var lngMap=[];
lngMap['en']='name_english';
lngMap['th']='name_thai';
lngMap['zh-tw']='name_chinese';
lngMap['zh-hans']='name_chinese_simple';


var Entry = sequelize.define('item', {
	id: {
    		type: Sequelize.BIGINT,
            primaryKey: true
	},
	nameThai: {
    		type: Sequelize.STRING,
            field: 'name_thai'
	},
	nameEnglish: {
    		type: Sequelize.STRING,
            field: 'name_english'
	},   
	nameChinese: {
    		type: Sequelize.STRING,
            field: 'name_chinese'
	},    
	nameChineseSimple: {
    		type: Sequelize.STRING,
            field: 'name_chinese_simple'
	},     
	minPrice: {
    		type: Sequelize.DECIMAL,
            field: 'min_price'
	},
	maxPrice: {
    		type: Sequelize.DECIMAL,
            field: 'max_price'
	},    
	dollar: {
    		type: Sequelize.INTEGER
	},
	spaceSize: {
    		type: Sequelize.DECIMAL,
            field: 'space_size'
	},
	houseType: {
    		type: Sequelize.DECIMAL,
            field: 'house_type'
	},
    rentType: {
    		type: Sequelize.INTEGER,
            field: 'rent_type'
	},
    floor: {
    		type: Sequelize.INTEGER
	},
    totalFloor: {
    		type: Sequelize.INTEGER,
            field: 'total_floor'
	},
    locationId: {
    		type: Sequelize.INTEGER,
            field: 'location_id'
	},    
    provinceId: {
    		type: Sequelize.INTEGER,
            field: 'province_id'
	},
    cityId: {
    		type: Sequelize.INTEGER,
            field: 'city_id'
	},
    address: {
    		type: Sequelize.STRING
	},
    rentLimit: {
    		type: Sequelize.INTEGER,
            field: 'rent_limit'
	},
    status: {
    		type: Sequelize.INTEGER
	},
    createdAt: {
    		type: Sequelize.DATE,
            field: 'created_at'
	},
    createrId: {
    		type: Sequelize.STRING,
            field: 'creater_id'
	},
    updatedAt: {
    		type: Sequelize.DATE,
            field: 'updated_at'
	},
    updaterId: {
    		type: Sequelize.STRING,
            field: 'updater_id'
	},

}, {
	
	freezeTableName: true
});

 

Entry.sync({ force: false });
 


exports.find = function(id) {
	return Entry.find({where :{id:id } });
};

exports.findWithUserId = function(id,userId) {
	return Entry.find({where :{id:id,createrId:userId} });
};


exports.findByProvinceId = function(provinceId) {
	return Entry.findAll({ where: { status: 1 , provinceId: provinceId} });
};

exports.findByCityId = function(cityId) {
	return Entry.findAll({ where: { status: 1 , cityId: cityId} });
};


exports.findByTitle = function(title) {
	return Entry.findOne({ where: { titleThai: title } });
};

exports.findAll2 = function(provinceId,cityId,houseType,keyword,offset) {
 
    var whereParams = new Object();
    whereParams.status=1;
     
    if(provinceId!=null&&provinceId!=''){
        whereParams.provinceId=provinceId;
    }

    if(cityId!=null&&cityId!=''){
        whereParams.cityId=cityId;
    }

    if(houseType!=null&&houseType!=''){
        whereParams.houseType=houseType;
    }
    
    if(keyword!=null&&keyword!=''){
        whereParams.keyword=keyword;
    }  
    
    if(offset!=null&&offset!=''){
        queryParams.offset=offset;
    }    
                      
    queryParams.where = whereParams;
    
    return Entry.findAndCountAll(queryParams);
};
 
   
exports.findAll = function(query) {
    var queryParams = new Object();
    var whereParams = new Object();
    
    if(query.userId!=null&&query.userId!=''){
        whereParams.createrId=query.userId;
    }
    
    if(query.provinceId!=null&&query.provinceId!=''){
        whereParams.provinceId=query.provinceId;
    }

    if(query.cityId!=null&&query.cityId!=''){
        whereParams.cityId=query.cityId;
    }
    
    if(query.locationId!=null&&query.locationId!=''){
        whereParams.locationId=query.locationId;
    }
     

    if(query.houseType!=null&&query.houseType!=''){
        whereParams.houseType=query.houseType;
    }
    
    if(query.keyword!=null&&query.keyword!=''){
        whereParams.keyword=query.keyword;
    }      
 
    
    console.log('----------query.minPrice:'+query.minPrice+"__"+query.maxPrice);
    
    if(query.minPrice!=null&&query.minPrice!=''&&query.maxPrice!=null&&query.maxPrice!=''){
        whereParams.minPrice={between: [query.minPrice, query.maxPrice]};
    }         
    
    var lng = lngMap[query.lng] ? lngMap[query.lng]  : default_lng; 
    queryParams.attributes=[
                            'id',
                            'minPrice', 
                            'maxPrice', 
                            'dollar',
                            'spaceSize',
                            'houseType',
                            'rentType',
                            'floor',
                            'totalFloor',
                            'locationId',    
                            'provinceId',
                            'cityId',
                            'address',
                            'rentLimit',
                            'status',
                            [lng,'name']
                            ]; 
  
  
    queryParams.where = whereParams;
    
    if(query.offset!=null&&query.offset!=''){
        queryParams.offset=query.offset;
    }
    
    var limit = query.limit!=null&&query.limit!='' ? query.limit : defaultQueryParams.limit;
    queryParams.limit=limit;
    
    
    if(query.page!=null&&query.page!=''){
        queryParams.offset=(query.page-1)*limit;
    }    
     
    var lng = lngMap[query.lng] ? lngMap[query.lng]  : default_lng; 
    
  
     
	return Entry.findAndCountAll(queryParams);
};





        
exports.findAllByUserId = function(userId,offset) {
     var queryParams = new Object();
    
    var whereParams = new Object();
    whereParams.createrId=userId;
    queryParams.where = whereParams;
    
    if(offset!=null&&offset!=''){
        queryParams.offset=offset;
    }  
    
    queryParams.limit=defaultQueryParams.limit;
     
	return Entry.findAndCountAll(queryParams);
};

//1:apartment ; 2:condo ; 3:house 
exports.add = function(titleThai,titleEnglish,titleChinese ,minPrice,maxPrice, spaceSize, houseType,rentType, floor, totalFloor,locationId,provinceId,cityId,address,rentLimit, createrId) {
	return Entry.create({
    	titleThai: titleThai,
        titleEnglish: titleEnglish,
        titleChinese: titleChinese,
    	minPrice: minPrice,
        maxPrice: maxPrice,
        spaceSize: spaceSize,
        houseType:houseType,
        rentType: rentType,
        floor: floor,
        totalFloor: totalFloor,
        locationId: locationId,
        provinceId:provinceId,
        cityId:cityId,
        address:address,
        rentLimit:rentLimit,
        status: 1,
        createrId: createrId,
        updaterId: createrId
	});
};


exports.update = function(id,titleThai,titleEnglish,titleChinese ,minPrice,maxPrice, spaceSize, houseType,rentType, floor, totalFloor,locationId,provinceId,cityId,address,rentLimit, status , updaterId) {
      
	return Entry.update({
    	titleThai: titleThai,
        titleEnglish: titleEnglish,
        titleChinese: titleChinese,
    	minPrice: minPrice,
        maxPrice: maxPrice,
        spaceSize: spaceSize,
        houseType:houseType,
        rentType: rentType,
        floor: floor,
        totalFloor: totalFloor,
        locationId:locationId,
        provinceId:provinceId,
        cityId:cityId,
        address:address,
        rentLimit:rentLimit,
        status: status, 
        updaterId: updaterId
    }, 
    
    {where:{id:id , createrId:updaterId}
    }) .then(function(affectedCount){
            console.log("-----update:"+result);
            return affectedCount; 
    })
    .catch(err => console.log(err));
   
};


