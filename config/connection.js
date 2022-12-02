const mysql2 = require("mysql2/promise");
const configEnv = require("../config/env");

const pool = mysql2.createPool({
  host: configEnv.mysql.host,
  user: configEnv.mysql.user,
  password: configEnv.mysql.password,
  database: configEnv.mysql.database,
});

pool.getConnection((err, connection) => {
  if (err) throw err;
  console.log("Database connected successfully");
  connection.release();
});

module.exports = pool;
