const pintRepository = require('../repositories/pintRepository');
const logRepository = require('../repositories/logRepository');

exports.logPint = async (pintName, barId, rating, description) => {
  const connection = await pintRepository.getConnection();
  let pintId;

  try {
    await connection.beginTransaction();

    pintId = await pintRepository.getPintId(connection, pintName);
    if (!pintId) {
      pintId = await pintRepository.createPint(connection, pintName);
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
}

exports.listPintLogs = async () => {
  const connection = await logRepository.getConnection();
  try {
    return await logRepository.listPintLogs(connection);
  } finally {
    await connection.release();
  }
}