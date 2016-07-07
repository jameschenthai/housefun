var Sequelize = require('sequelize');
var sequelize = require('../conf/db');
 
var default_lng='name_thai';

var lngMap=[];
lngMap['en']='name_english';
lngMap['th']='name_thai';
lngMap['zh-tw']='name_chinese';
lngMap['zh-hans']='name_chinese_simple';



var Entry = sequelize.define('location', {
	id: {
    		type: Sequelize.BIGINT,
            primaryKey: true
	},
	typeId: {
    		type: Sequelize.INTEGER,
            field: 'type_id'
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

 

var entry = Entry.sync({ force: false });
 
 

exports.find = function(id) {
	return Entry.find({where :{id:id } });
};

  

exports.findAll = function(query) {
    var queryParams = new Object();
    var whereParams = new Object();
    
     if(query.typeId!=null&&query.typeId!=''){
        whereParams.typeId=query.typeId;
    }
     
    queryParams.where = whereParams;
     
 
    var lng = lngMap[query.lng] ? lngMap[query.lng]  : default_lng; 
    queryParams.attributes=['id',[lng,'name']]; 
 
    return Entry.findAll(queryParams);
};

 

