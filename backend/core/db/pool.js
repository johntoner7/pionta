const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'pionta',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

exports.getConnection = async () => {
  return await pool.getConnection();
};

module.exports = pool;