const mysql = require("mysql2");
const { HOST, USERNAME, PASSWORD, DATABASE, DB_PORT } = require("./index");

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

module.exports = pool;
