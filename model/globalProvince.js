var Sequelize = require('sequelize');
var sequelize = require('../conf/db');
 
var default_lng='name_thai';

var lngMap=[];
lngMap['en']='name_english';
lngMap['th']='name_thai';
lngMap['zh-tw']='name_chinese';
lngMap['zh-hans']='name_chinese_simple';


var Entry = sequelize.define('global_province', { 
	cityId: {
    		type: Sequelize.STRING,
            field: 'city_id'
	},    
	provinceId: {
    		type: Sequelize.INTEGER,
            field: 'province_id'
	},

	provinceNameThai: {
    		type: Sequelize.STRING,
            field: 'province_name_thai'
	},    
    provinceNameEnglish: {
    		type: Sequelize.STRING,
            field: 'province_name_english'
	},
     
    sortNum: {
    		type: Sequelize.INTEGER,
            field: 'sort_num'
	},
	 

    cityNameThai: {
    		type: Sequelize.STRING,
            field: 'city_name_thai'
	},    
    cityNameEnglish: {
    		type: Sequelize.STRING,
            field: 'city_name_english'
	},
    cityNameChinese: {
    		type: Sequelize.STRING,
            field: 'city_name_chinese'
	},
    cityNameChineseSimple: {
    		type: Sequelize.STRING,
            field: 'city_name_chinese_simple'
	},    
    postCode: {
    		type: Sequelize.INTEGER,
            field: 'post_code'
	},    
    status: {
    		type: Sequelize.INTEGER
	},
    createdAt: {
    		type: Sequelize.DATE,
            field: 'created_at'
	},
    ceaterId: {
    		type: Sequelize.STRING,
            field: 'ceater_id'
	},
    updatedAt: {
    		type: Sequelize.DATE,
            field: 'updated_at'
	},
    updaterId: {
    		type: Sequelize.STRING,
            field: 'updater_id'
	}    
}, {
	
	freezeTableName: true
});

 
Entry.sync({ force: false });
 
   
exports.findAll = function(query) {
    var queryParams = new Object();
    var whereParams = new Object();
    
    whereParams.status=1;
    
     if(query.provinceId!=null&&query.provinceId!=''){
        whereParams.provinceId=query.provinceId;
    }
     
    queryParams.where = whereParams;
    queryParams.order = 'sort_num ASC';
     
 
    var lng = lngMap[query.lng] ? lngMap[query.lng]  : default_lng; 
    queryParams.attributes=['cityId',['city_'+lng,'name']]; 
 
    return Entry.findAll(queryParams);
     
};

 
exports.findByCityId = function(cityId) {
    return Entry.findAll({
        attributes: ['provinceId','provinceNameThai', 'provinceNameEnglish','cityId','cityNameThai', 'cityNameEnglish'] ,  
        where: { status:1 , cityId: cityId } ,
        order: 'sort_num ASC'
    });
};

