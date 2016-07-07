var Sequelize = require('sequelize');
var sequelize = require('../conf/db');
var crypto = require('crypto');

      
var Entry = sequelize.define('user', {
	id: {
    		type: Sequelize.BIGINT,
            primaryKey: true
	},
	name: {
    		type: Sequelize.STRING
	},
	email: {
    		type: Sequelize.STRING
	},
	mobilePhone: {
    		type: Sequelize.STRING,
            field: 'mobile_phone'
	},    
	password: {
    		type: Sequelize.STRING
	},    
	useFb: {
    		type: Sequelize.INTEGER,
            field: 'use_fb'
	},    
	isMerchant: {
    		type: Sequelize.INTEGER,
            field: 'is_merchant'
	},
	emailConfirmStatus: {
    		type: Sequelize.INTEGER,
            field: 'email_confirm_status'
	},        
	emailConfirmCode: {
    		type: Sequelize.STRING,
            field: 'email_confirm_code'
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
	},

}, {
	
	freezeTableName: true
});

 

Entry.sync({ force: false });



exports.find = function(id) {
	return Entry.find({where :{id:id } });
};

 
exports.isEmailExist = function(email) {
    return Entry.findOne({ where: { email: email} ,attributes:['email']});
};

exports.findByEmail = function(email) {
    return Entry.findOne({ where: { email: email} });
};
 
 
exports.findByName = function(name) {
	return Entry.findOne({ where: { name: name } });
};

exports.findAll = function() {
	return Entry.findAll({ where: { status: 1 } });
};

  
exports.add = function(name ,email,password, useFb, isMerchant, ceaterId) {
	return Entry.create({
    	name: name,
    	email: email, 
        password:crypto.createHash('md5').update(password).digest("hex"),
        useFb:useFb,
        isMerchant:isMerchant,
        emailConfirmCode:Math.random().toString(36).substr(2)+Math.random().toString(36).substr(2), 
        ceaterId: ceaterId,
        updaterId: ceaterId
	});
};


exports.update = function(id,name ,password, updaterId) {     
	return Entry.update({
    	name: name, 
        password:crypto.createHash('md5').update(password).digest("hex"),
        updaterId: updaterId
    }, 
    
    {where:{id:id}
    }) .then(function(affectedCount){
            console.log("-----update:"+result);
            return affectedCount; 
    })
    .catch(err => console.log(err));
   
};

exports.updateEmailVaildate = function(email,emailConfirmCode) {     
	return Entry.update({
    	emailConfirmStatus: 1
    }, 
    
    {where:{email:email ,emailConfirmCode:emailConfirmCode }
    }) .then(function(affectedCount){
            console.log("-----update:"+result);
            return affectedCount; 
    })
    .catch(err => console.log(err));
   
};

exports.decodingPassword = function(password){ 
    return crypto.createHash('md5').update(password).digest("hex");
};

exports.validPassword = function(password){ 
    return user.password == crypto.createHash('md5').update(password).digest("hex");
};

