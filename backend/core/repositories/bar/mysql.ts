import { PoolConnection, QueryResult, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import db from '../../db/pool';
import BarRepository from './interface';

export const listBars = async (): Promise<QueryResult> => {
  const connection = await db.getConnection();

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

export const getBarId = async (barName: string): Promise<number> => {
  const connection = await db.getConnection();
  const [rows] = await connection.execute<RowDataPacket[]>('SELECT id FROM bars WHERE name = ?', [barName]);
  return rows.length ? rows[0].id : null;
};

export const addBar = async (name: string, description: string, latitude: number, longitude: number): Promise<number> => {
  const connection = await db.getConnection(); 
  const [result] = await connection.execute<ResultSetHeader>('INSERT INTO bars (name, description, latitude, longitude) VALUES (?, ?, ?, ?)', [name, description, latitude, longitude]);
  return result.insertId;
};

const mysqlBarRepository: BarRepository = {
  listBars,
  getBarId,
  addBar,
};

export default mysqlBarRepository;