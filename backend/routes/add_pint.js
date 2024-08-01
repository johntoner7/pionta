const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise'); // Ensure you are using the promise-based version

router.post('/api/pint', async (req, res) => {
  const { pintName, barName, price } = req.body;

  
  if (!pintName || !barName || price === null) {
      return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      database: 'pionta',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
  });
  let connection;
  try {
      connection = await pool.getConnection();
      await connection.beginTransaction();
  
      const [pintResult] = await connection.execute(
          'INSERT INTO pints (name) VALUES (?)',
          [pintName]
      );
      const pintId = pintResult.insertId;
  
      const [barRow] = await connection.execute(
          'SELECT id FROM bars WHERE name = ?',
          [barName]
      );
      if (!barRow.length) {
          throw new Error(`Bar with name ${barName} not found`);
      }
      const barId = barRow[0].id;
  
      // Continue with the rest of your code...
  } catch (error) {
      if (connection) await connection.rollback();
      return res.status(500).json({ error: error.message });
  } finally {
      if (connection) await connection.release();
  }
  
  await connection.execute(
      'INSERT INTO prices (barId, pintId, price) VALUES (?, ?, ?)',
      [barId, pintId, price]
  );
  
  await connection.commit();
  
  res.status(201).json({
      message: 'Pint and price added successfully',
      pintId,
      barId,
      price
  });
});

module.exports = router;

