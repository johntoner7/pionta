import { PoolConnection, ResultSetHeader } from 'mysql2/promise';

export const getPintId = async (connection: PoolConnection, pintName: string): Promise<number | null> => {
  const [rows]: any[] = await connection.execute('SELECT id FROM pints WHERE name = ?', [pintName]);
  return rows.length ? rows[0].id : null;
};

export const createPint = async (connection: PoolConnection, pintName: string): Promise<number> => {
  const [result] = await connection.execute<ResultSetHeader>('INSERT INTO pints (name) VALUES (?)', [pintName]);
  return result.insertId;
};

export const addPrice = async (connection: PoolConnection, barId: number, pintId: number, price: number): Promise<void> => {
  await connection.execute('INSERT INTO prices (barId, pintId, price) VALUES (?, ?, ?)', [barId, pintId, price]);
};

export const deletePint = async (connection: PoolConnection, id: number): Promise<void> => {
  await connection.execute('DELETE FROM pints WHERE id = ?', [id]);
}

export const deletePrice = async(connection: PoolConnection, barId: number, pintId: number, price: number): Promise<void> => {
  await connection.execute('DELETE FROM prices WHERE barId = ? AND pintId = ? AND price = ?', [barId, pintId, price]);
}

export default {
  getPintId,
  createPint,
  addPrice,
  deletePint,
  deletePrice,
};