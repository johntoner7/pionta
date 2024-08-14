import { QueryResult, ResultSetHeader } from 'mysql2/promise';
import db from '../../db/pool';
import { PintRepository } from './interface';

export const getPintId = async (pintName: string): Promise<number | null> => {
  const connection = await db.getConnection();
  const [rows]: any[] = await connection.execute('SELECT id FROM pints WHERE name = ?', [pintName]);
  return rows.length ? rows[0].id : null;
};

export const createPint = async (pintName: string): Promise<number> => {
  const connection = await db.getConnection();
  const [result] = await connection.execute<ResultSetHeader>('INSERT INTO pints (name) VALUES (?)', [pintName]);
  return result.insertId;
};

export const addPrice = async (barId: number, pintId: number, price: number): Promise<void> => {
  const connection = await db.getConnection();
  await connection.execute('INSERT INTO prices (barId, pintId, price) VALUES (?, ?, ?)', [barId, pintId, price]);
};

export const deletePint = async (id: number): Promise<void> => {
  const connection = await db.getConnection();
  await connection.execute('DELETE FROM pints WHERE id = ?', [id]);
}

export const deletePrice = async(barId: number, pintId: number, price: number): Promise<void> => {
  const connection = await db.getConnection();
  await connection.execute('DELETE FROM prices WHERE barId = ? AND pintId = ? AND price = ?', [barId, pintId, price]);
}


const mysqlPintRepository: PintRepository = {
    getPintId,
    createPint,
  addPrice,
  deletePint,
  deletePrice,
};

export default mysqlPintRepository;