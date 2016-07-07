var Client = require('mariasql');

var c = new Client({
  host: 'rentdbinstance.c1qqjddeuiar.us-west-2.rds.amazonaws.com',
  user: 'rent_db_root',
  password: 'rent_root_james'
});

c.query('SELECT * FROM rentdb.item ',
        {},
        function(err, rows) {
  if (err)
    throw err;
  console.dir(rows);
});
c.end();

 