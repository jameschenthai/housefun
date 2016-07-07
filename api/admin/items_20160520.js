var express = require('express');
var router = express.Router();
var dbClient = require('mariasql');

var c = new dbClient({
  host: 'rentdbinstance.c1qqjddeuiar.us-west-2.rds.amazonaws.com',
  user: 'rent_db_root',
  password: 'rent_root_james'
});


router.route('/item/:id') 

.get(function(req, res) {
	var rowsCount=0;
	c.query('SELECT * FROM rentdb.item ',
        	{},
        	function(err, rows) {
  			if (err)
    				throw err;
  			console.dir(rows);
			rowsCount=rows.length;
		});
	c.end();


    res.json({
        id: req.params.id, // 以req.params.id 取得參數

        message: 'The get api for image: ' + req.params.id+',count='+rowsCount
    })
})

.post(function(req, res) {
    res.json({
        id: req.params.id,
        message: 'The post api for image: ' + req.params.id
    })
})

.put(function(req, res) {
    res.json({
        id: req.params.id,
        message: 'The put api for image: ' + req.params.id
    })
})

.delete(function(req, res) {
    res.json({
        id: req.params.id,
        message: 'The delete api for image: ' + req.params.id
    })
});

module.exports = router;
