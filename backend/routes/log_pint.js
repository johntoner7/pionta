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

router.post('/api/pint/log', async (req, res) => {
    try {
        const { pintName, barId, rating, description } = req.body;

        if (!pintName || !barId) {
            return res.status(400).json({ error: 'Pint Name and Bar ID are required' });
        }

        const connection = await pool.getConnection();
        await connection.beginTransaction();

        const [existingPint] = await connection.execute(
            'SELECT id FROM pints WHERE name = ?',
            [pintName]
        );

        let pintId;
        if (existingPint.length) {
            pintId = existingPint[0].id;
        } else {
            const [pintResult] = await connection.execute(
                'INSERT INTO pints (name) VALUES (?)',
                [pintName]
            );
            pintId = pintResult.insertId;
        }

        await connection.execute(
            'INSERT INTO pint_logs (pintId, barId, rating, description) VALUES (?, ?, ?, ?)',
            [pintId, barId, rating || null, description || null]
        );

        await connection.commit();

        res.status(201).json({ message: 'Pint logged successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
