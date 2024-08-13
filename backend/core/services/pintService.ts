import pintRepository from '../repositories/pintRepository';
import pool from '../db/pool';

interface AddPintResponse {
  message: string;
  pintId: number;
  barId: number;
  price: number;
}

export const addPint = async (pintName: string, barId: number, price: number): Promise<AddPintResponse> => {
  const connection = await pool.getConnection();
  let pintId: number | null;

  try {
    await connection.beginTransaction();

    pintId = await pintRepository.getPintId(connection, pintName);
    if (!pintId) {
      pintId = await pintRepository.createPint(connection, pintName);
    }

    await pintRepository.addPrice(connection, barId, pintId, price);

    await connection.commit();

    return { message: 'Pint and price added successfully', pintId, barId, price };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.release();
  }
};

export const deletePint = async (id: number): Promise<void> => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await pintRepository.deletePint(connection, id);

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.release();
  }
}

export const deletePrice = async (barId: number, pintId: number, price: number): Promise<void> => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await pintRepository.deletePrice(connection, barId, pintId, price);

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.release();
  }
}

export default {
  addPint,
  deletePint,
  deletePrice,
}