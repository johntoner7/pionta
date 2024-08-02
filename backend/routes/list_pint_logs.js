const express = require('express');
const mysql = require('mysql2/promise');

const router = express.Router();

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'pionta',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

router.get('/api/pint/logs', async (_, res) => {
    let connection;
    try {
        connection = await pool.getConnection();

        const [logs] = await connection.execute(
            `SELECT pl.id, p.name AS pintName, b.name AS barName, pl.rating, pl.description, pl.created_at
             FROM pint_logs pl
             JOIN pints p ON pl.pintId = p.id
             JOIN bars b ON pl.barId = b.id
             ORDER BY pl.created_at DESC`
        );

        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (connection) connection.release();
    }
});

module.exports = router;
