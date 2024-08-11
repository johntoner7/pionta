exports.listBars = async (connection) => {
  const [rows] = await connection.query(`
    SELECT b.id, b.longitude, b.latitude, b.name AS name, b.description AS description,
           JSON_ARRAYAGG(JSON_OBJECT('name', p.name, 'price', pr.price)) AS pintPrices
    FROM bars AS b
    LEFT JOIN prices AS pr ON b.id = pr.barId
    LEFT JOIN pints AS p ON pr.pintId = p.id
    GROUP BY b.id;
  `);

  return rows;
};

exports.getBarId = async (connection, barName) => {
  const [rows] = await connection.execute('SELECT id FROM bars WHERE name = ?', [barName]);
  return rows.length ? rows[0].id : null;
};

exports.addBar = async (connection, name, description, latitude, longitude) => {
  const [result] = await connection.execute('INSERT INTO bars (name, description, latitude, longitude) VALUES (?, ?, ?, ?)', [name, description, latitude, longitude]);
  return result.insertId;
};
