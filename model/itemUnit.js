var Sequelize = require('sequelize');
var sequelize = require('../conf/db');

var Entry = sequelize.define('item_unit', {
	id: {
    		type: Sequelize.BIGINT,
            primaryKey: true
	},
	itemId: {
    		type: Sequelize.BIGINT,
             field: 'item_id'
	},    
	name: {
    		type: Sequelize.STRING
	},
	houseType: {
    		type: Sequelize.DECIMAL,
            field: 'house_type'
	},    
    roomQuantity: {
    		type: Sequelize.INTEGER,
            field: 'room_quantity'
	},     
	monthlyMinPrice: {
    		type: Sequelize.DECIMAL,
            field: 'monthly_min_price'
	},
	monthlyMaxPrice: {
    		type: Sequelize.DECIMAL,
            field: 'monthly_max_price'
	},
	dailyMinPrice: {
    		type: Sequelize.DECIMAL,
            field: 'daily_min_price'
	},
	daillyMaxPrice: {
    		type: Sequelize.DECIMAL,
            field: 'daily_max_price'
	},      
	spaceSize: {
    		type: Sequelize.DECIMAL,
            field: 'space_size'
	},  
    floor: {
    		type: Sequelize.INTEGER
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

 
exports.findAllByItemId = function(itemId) {
	return Entry.findAll({ where: { itemId: itemId } });
};

exports.findAllByItemId = function(itemId) {
	return Entry.findAll({ where: { itemId: itemId } });
};

exports.findAllAvailableByItemId = function(itemId,status) {
	return Entry.findAll({ where: { status:1 , itemId: itemId } });
};
 
exports.findAll = function() {
	return Entry.findAll({ where: { } });
};
    
        
exports.add = function(itemId,name,monthlyMinPrice,monthlyMaxPrice,dailyMinPrice,daillyMaxPrice, spaceSize, houseType,roomQuantity , floor,rentLimit, createrId) {
	return Entry.create({
        itemId: itemId,
    	name: name,
    	monthlyMinPrice: monthlyMinPrice,
        monthlyMaxPrice: monthlyMaxPrice,
        dailyMinPrice: dailyMinPrice,
        daillyMaxPrice: daillyMaxPrice,
        spaceSize: spaceSize,
        houseType:houseType,
        roomQuantity: roomQuantity,
        floor: floor,  
        rentLimit:rentLimit,
        status: 1,
        createrId: createrId,
        updaterId: createrId
	});
};


exports.update = function(id,itemId, name,monthlyMinPrice,monthlyMaxPrice,dailyMinPrice,daillyMaxPrice, spaceSize, houseType,roomQuantity , floor,rentLimit, status ,updaterId) {
     
	return Entry.update({ 
    	name: name,
    	monthlyMinPrice: monthlyMinPrice,
        monthlyMaxPrice: monthlyMaxPrice,
        dailyMinPrice: dailyMinPrice,
        daillyMaxPrice: daillyMaxPrice,
        spaceSize: spaceSize,
        houseType:houseType,
        roomQuantity: roomQuantity,
        floor: floor,  
        rentLimit:rentLimit,
        updaterId: updaterId,
        status: status
    }, 
    
    {where:{id:id , itemId:itemId, createrId:updaterId}
    }) .then(function(affectedCount){
            console.log("-----update:"+result);
            return affectedCount; 
    })
    .catch(err => console.log(err));
   
};


