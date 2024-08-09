const pintRepository = require('../repositories/pintRepository');

exports.addPint = async (pintName, barName, price) => {
  const connection = await pintRepository.getConnection();
  let pintId, barId;

  try {
    await connection.beginTransaction();

    pintId = await pintRepository.getPintId(connection, pintName);
    if (!pintId) {
      pintId = await pintRepository.createPint(connection, pintName);
    }

    barId = await pintRepository.getBarId(connection, barName);
    if (!barId) {
      throw new Error(`Bar with name ${barName} not found`);
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

