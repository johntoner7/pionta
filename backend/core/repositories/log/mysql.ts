import { FieldPacket, QueryResult } from 'mysql2/promise';
import db from '../../db/mysql/pool';
import LogRepository from './interface';
import { PintLog, PintLogRequest } from '../../../../shared/types/pintLog';

export const logPint = async (log: PintLogRequest, pintId: number): Promise<void> => {
  const connection = await db.getConnection();
  const safeRating = log.rating !== undefined ? log.rating : null;
  const safeDescription = log.description !== undefined ? log.description : null;
  await connection.execute('INSERT INTO pint_logs (pintId, barId, rating, description) VALUES (?, ?, ?, ?)', [pintId, log.barId, safeRating, safeDescription]);
};

export const listPintLogs = async (): Promise<PintLog[]> => {
  const connection = await db.getConnection();
  const [rows]: [QueryResult, FieldPacket[]] = await connection.execute(
    `SELECT pl.id, p.name AS pintName, b.name AS barName, pl.rating, pl.description, pl.logDate
          FROM pint_logs pl
          JOIN pints p ON pl.pintId = p.id
          JOIN bars b ON pl.barId = b.id
          ORDER BY pl.logDate DESC`,
  );
  connection.release();

  return rows as PintLog[];
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