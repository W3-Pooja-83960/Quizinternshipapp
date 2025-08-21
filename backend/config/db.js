const mysql = require("mysql2");
const { HOST, USERNAME, PASSWORD, DATABASE, DB_PORT } = require("./index");

const pool = mysql.createPool({
  host: HOST,
  user: USERNAME,
  password: PASSWORD,
  database: DATABASE,
  port: DB_PORT,   // ✅ use DB port here
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

module.exports = pool;
