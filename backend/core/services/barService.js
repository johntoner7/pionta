const barRepository = require('../repositories/barRepository');
const db = require('../db/pool');

exports.addBar = async (name, description, latitude, longitude) => {
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
}

exports.listBars = async () => {
  const connection = await db.getConnection();

    const result = await barRepository.listBars(connection);
    await connection.release();
    return result;
};