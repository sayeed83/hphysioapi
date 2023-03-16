const mysql = require('mysql');
var con = mysql.createConnection({
    host: process.env.DB_HOST,
  	user: process.env.DB_USER,
  	password: process.env.DB_PWD,
	port: process.env.DB_PORT,
	database: process.env.DB_NAME,
	multipleStatements: true
});
module.exports = con;