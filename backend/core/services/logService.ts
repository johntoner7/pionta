import pintRepository from '../repositories/pintRepository';
import logRepository from '../repositories/logRepository';
import pool from '../db/pool';

export const logPint = async (pintName: string, barId: number, rating?: number, description?: string, price?: number) => {
  const connection = await pool.getConnection();
  let pintId: number | null;

  try {
    await connection.beginTransaction();
    pintId = await pintRepository.getPintId(connection, pintName);
    if (!pintId) {
      pintId = await pintRepository.createPint(connection, pintName);
    }
    if (price) {
      await pintRepository.addPrice(connection, barId, pintId, price);
    }

    await logRepository.logPint(connection, pintId, barId, rating, description);

    await connection.commit();

    return { message: 'Pint logged successfully', pintId, barId, rating, description };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.release();
  }
};

export const listPintLogs = async () => {
  const connection = await pool.getConnection();
  try {
    return await logRepository.listPintLogs(connection);
  } finally {
    await connection.release();
  }
};

export const deleteLog = async (logId: number) => {
  const connection = await pool.getConnection();
  try {
    await logRepository.deleteLog(connection, logId);
  } finally {
    await connection.release();
  }
}

export default {
  logPint,
  listPintLogs,
  deleteLog,
}