import barRepository from '../repositories/barRepository';
import db from '../db/pool';

const addBar = async (name: string, description: string, latitude: number, longitude: number): Promise<any> => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const result = await barRepository.addBar(connection, name, description, latitude, longitude);

    await connection.commit();

    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.release();
  }
};

const listBars = async (): Promise<any> => {
  const connection = await db.getConnection();

  const result = await barRepository.listBars(connection);
  await connection.release();
  return result;
};

export default {
  addBar,
  listBars
};
