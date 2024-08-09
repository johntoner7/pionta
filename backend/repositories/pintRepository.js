const pool = require('../db/pool');

exports.getConnection = async () => {
  return await pool.getConnection();
};

exports.getPintId = async (connection, pintName) => {
  const [rows] = await connection.execute('SELECT id FROM pints WHERE name = ?', [pintName]);
  return rows.length ? rows[0].id : null;
};

exports.createPint = async (connection, pintName) => {
  const [result] = await connection.execute('INSERT INTO pints (name) VALUES (?)', [pintName]);
  return result.insertId;
};

exports.addPrice = async (connection, barId, pintId, price) => {
  await connection.execute('INSERT INTO prices (barId, pintId, price) VALUES (?, ?, ?)', [barId, pintId, price]);
};