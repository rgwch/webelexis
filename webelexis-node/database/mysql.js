/**
 * Created by gerry on 15.12.15.
 */
var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : '< MySQL username >',
  password : '< MySQL password >',
  database : '<your database name>'
});

connection.connect();
