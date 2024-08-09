exports.logPint = async (connection, pintId, barId, rating, description) => {
    await connection.execute('INSERT INTO pint_logs (pintId, barId, rating, description) VALUES (?, ?, ?, ?)', [pintId, barId, rating, description]);
}

exports.listPintLogs = async (connection) => {
    const [rows] = await connection.execute(
        `SELECT pl.id, p.name AS pintName, b.name AS barName, pl.rating, pl.description, pl.logDate
          FROM pint_logs pl
          JOIN pints p ON pl.pintId = p.id
          JOIN bars b ON pl.barId = b.id
          ORDER BY pl.logDate DESC`
    );
    return rows;
}