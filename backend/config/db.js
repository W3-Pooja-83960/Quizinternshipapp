const mysql = require("mysql2");
const { HOST, USERNAME, PASSWORD, DATABASE} = require(".");

const pool = mysql.createPool({
  host: HOST,
  user: USERNAME,
  password: PASSWORD,
  database: DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, 
  idleTimeout: 60000, 
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  dateStrings: true
 
});

const query = (sql, params) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

module.exports = pool;
