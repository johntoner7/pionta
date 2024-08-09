const barRepository = require('../repositories/barRepository');
const db = require('../db/pool');

exports.listBars = async () => {
  const connection = await db.getConnection();

    const result = await barRepository.listBars(connection);
    await connection.release();
    return result;
};