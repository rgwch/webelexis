/**
 * Created by gerry on 15.12.15.
 */
var mysql      = require('mysql');
var cfg=require('nconf').get("mysql")

var connection = mysql.createConnection({
  host     : cfg.host,
  user     : cfg.user,
  password : cfg.password,
  database : cfg.database
});

connection.connect();
