const mysql = require('mysql2');
const Client = require('ssh2').Client;

// SSH configuration
const sshConfig = {
  host: process.env.SSH_HOST,
  port: process.env.SSH_PORT,
  username: process.env.SSH_USER_NAME,
  password: process.env.SSH_PASSWORD
};

// MySQL configuration
const mysqlConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
};


// Create an SSH tunnel
const sshTunnel = new Client();
const connectionPromise = new Promise((resolve, reject) => {
  sshTunnel.on('ready', () => {
    sshTunnel.forwardOut(
      // source IP
      process.env.SOURCE_IP,
      // source port
      process.env.DB_PORT,
      // destination IP
      mysqlConfig.host,
      // destination port
      mysqlConfig.port,
      (err, stream) => {
        if (err) reject(err);

        // Connect to MySQL through the SSH tunnel
        const connection = mysql.createConnection({
          host: 'localhost',
          user: mysqlConfig.user,
          password: mysqlConfig.password,
          database: mysqlConfig.database,
          port: mysqlConfig.port,
          stream: stream // use the SSH tunnel stream as the connection
        });


        connection.connect((err) => {
          if (err) reject(err);
          console.log('Connected to MySQL database over SSH.');
          resolve(connection);
        });
      }
    );
  }).connect(sshConfig);
});
// Export a function that returns the connection
module.exports = async function() {
    return await connectionPromise;
};
// module.exports = await connectionPromise;

// const mysql = require('mysql');
// var con = mysql.createConnection({
//     host: process.env.DB_HOST,
//   	user: process.env.DB_USER,
//   	password: process.env.DB_PWD,
// 	port: process.env.DB_PORT,
// 	database: process.env.DB_NAME,
// 	multipleStatements: true
// });
// module.exports = con;





