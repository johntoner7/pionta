import { PoolConnection, QueryResult, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import db from '../../db/mysql/pool';
import BarRepository from './interface';
import { Bar } from './supabase';

export const listBars = async (): Promise<Bar[]> => {
  const connection = await db.getConnection();
  const [rows] = await connection.query(`
    SELECT b.id, b.longitude, b.latitude, b.name AS name, b.description AS description,
          COALESCE(
            (
              SELECT JSON_ARRAYAGG(JSON_OBJECT('id', p.id, 'name', p.name, 'price', pr.price))
              FROM prices AS pr
              LEFT JOIN pints AS p ON pr.pintId = p.id
              WHERE pr.barId = b.id
              ORDER BY p.name
            ), JSON_ARRAY()
          ) AS pintPrices
    FROM bars AS b
    LEFT JOIN prices AS pr ON b.id = pr.barId
    LEFT JOIN pints AS p ON pr.pintId = p.id
    GROUP BY b.id
    order by b.name;
  `);
  connection.release();
  return rows as unknown as Bar[];
};

export const getBarId = async (barName: string): Promise<number> => {
  const connection = await db.getConnection();
  const [rows] = await connection.execute<RowDataPacket[]>('SELECT id FROM bars WHERE name = ?', [barName]);
  connection.release();
  return rows.length ? rows[0].id : null;
};

export const addBar = async (name: string, description: string, latitude: number, longitude: number): Promise<number> => {
  const connection = await db.getConnection(); 
  const [result] = await connection.execute<ResultSetHeader>('INSERT INTO bars (name, description, latitude, longitude) VALUES (?, ?, ?, ?)', [name, description, latitude, longitude]);
  connection.release();
  return result.insertId;
};

const mysqlBarRepository: BarRepository = {
  listBars,
  getBarId,
  addBar,
};

export default mysqlBarRepository;