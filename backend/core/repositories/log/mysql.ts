import { QueryResult } from 'mysql2/promise';
import db from '../../db/pool';
import LogRepository from './interface';

export const logPint = async (pintId: number, barId: number, rating?: number, description?: string): Promise<void> => {
  const connection = await db.getConnection();
  const safeRating = rating !== undefined ? rating : null;
  const safeDescription = description !== undefined ? description : null;
  await connection.execute('INSERT INTO pint_logs (pintId, barId, rating, description) VALUES (?, ?, ?, ?)', [pintId, barId, safeRating, safeDescription]);
};

export const listPintLogs = async (): Promise<QueryResult> => {
  const connection = await db.getConnection();
  const [rows] = await connection.execute(
    `SELECT pl.id, p.name AS pintName, b.name AS barName, pl.rating, pl.description, pl.logDate
          FROM pint_logs pl
          JOIN pints p ON pl.pintId = p.id
          JOIN bars b ON pl.barId = b.id
          ORDER BY pl.logDate DESC`,
  );
  connection.release();
  return rows;
};

export const deleteLog = async (logId: number): Promise<void> => {
  const connection = await db.getConnection();
  await connection.execute('DELETE FROM pint_logs WHERE id = ?', [logId]);
}

const mysqlLogRepository: LogRepository = {
  logPint,
  listPintLogs,
  deleteLog,
};

export default mysqlLogRepository;