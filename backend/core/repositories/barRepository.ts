import { PoolConnection, QueryResult, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

export const listBars = async (connection: PoolConnection): Promise<QueryResult> => {
  const [rows] = await connection.query(`
    SELECT b.id, b.longitude, b.latitude, b.name AS name, b.description AS description,
           JSON_ARRAYAGG(JSON_OBJECT('id', p.id, 'name', p.name, 'price', pr.price)) AS pintPrices
    FROM bars AS b
    LEFT JOIN prices AS pr ON b.id = pr.barId
    LEFT JOIN pints AS p ON pr.pintId = p.id
    GROUP BY b.id;
  `);

  return rows;
};

export const getBarId = async (connection: PoolConnection, barName: string): Promise<number> => {
  const [rows] = await connection.execute<RowDataPacket[]>('SELECT id FROM bars WHERE name = ?', [barName]);
  return rows.length ? rows[0].id : null;
};

export const addBar = async (connection: PoolConnection, name: string, description: string, latitude: number, longitude: number): Promise<number> => {
  const [result] = await connection.execute<ResultSetHeader>('INSERT INTO bars (name, description, latitude, longitude) VALUES (?, ?, ?, ?)', [name, description, latitude, longitude]);
  return result.insertId;
};

export default {
  listBars,
  getBarId,
  addBar,
};
