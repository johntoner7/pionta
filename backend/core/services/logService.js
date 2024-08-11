const pintRepository = require('../repositories/pintRepository');
const logRepository = require('../repositories/logRepository');
const db = require('../db/pool');

exports.logPint = async (pintName, barId, rating, description, price) => {
  const connection = await db.getConnection();
  let pintId;

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

exports.listPintLogs = async () => {
  const connection = await db.getConnection();
  try {
    return await logRepository.listPintLogs(connection);
  } finally {
    await connection.release();
  }
};