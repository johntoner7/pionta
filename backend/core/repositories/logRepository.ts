import { PoolConnection } from 'mysql2/promise';
import { QueryResult } from 'mysql2/promise';

export const logPint = async (connection: PoolConnection, pintId: number, barId: number, rating?: number, description?: string): Promise<void> => {
  const safeRating = rating !== undefined ? rating : null;
  const safeDescription = description !== undefined ? description : null;
  await connection.execute('INSERT INTO pint_logs (pintId, barId, rating, description) VALUES (?, ?, ?, ?)', [pintId, barId, safeRating, safeDescription]);
};

export const listPintLogs = async (connection: PoolConnection): Promise<QueryResult> => {
  const [rows] = await connection.execute(
    `SELECT pl.id, p.name AS pintName, b.name AS barName, pl.rating, pl.description, pl.logDate
          FROM pint_logs pl
          JOIN pints p ON pl.pintId = p.id
          JOIN bars b ON pl.barId = b.id
          ORDER BY pl.logDate DESC`,
  );
  return rows;
};

export default {
  logPint,
  listPintLogs,
};