const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const listBarsRouter = require('./routes/list_bars');
const addPintRouter = require('./routes/add_pint');
const app = express();

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'pionta',
  connectionLimit: 10,
});

console.log();

app.use(cors());
app.use(express.json());

app.get('/api/bars', listBarsRouter);
app.post('/api/pint', addPintRouter);

const port = 8080;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = { app, pool };
