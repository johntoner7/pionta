const express = require('express');
const mysql = require('mysql2');

const router = express.Router();


// Route to handle GET request for /api/bars
router.get('/api/bars', (req, res) => {
  // Retrieve data from the database
  const { pool } = require('../server');
  pool.query(`
    SELECT b.id, b.longitude, b.latitude, b.name AS name, b.description AS description,
           JSON_ARRAYAGG(JSON_OBJECT('name', p.name, 'price', pr.price)) AS pintPrices
    FROM bars AS b
    LEFT JOIN prices AS pr ON b.id = pr.barId
    LEFT JOIN pints AS p ON pr.pintId = p.id
    GROUP BY b.id;
  `, (error, results, fields) => {
    if (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Error fetching data' });
    } else {
      res.json({ bars: results });
    }
  });
});

module.exports = router;