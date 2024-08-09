const barRepository = require('../repositories/barRepository');

exports.listBars = async () => {
  const connection = await barRepository.getConnection();

    const result = await barRepository.listBars(connection);
    await connection.release();
    return result;
};