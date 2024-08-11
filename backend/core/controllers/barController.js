const barService = require('../services/barService');
const logger = require('../../logger');

exports.addBar = async (req, res) => {
  const { name, description, latitude, longitude } = req.body;

  try {
    const result = await barService.addBar(name, description, latitude, longitude);
    res.json({ message: 'Bar added successfully', barId: result });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: error.message });
  }
}

exports.listBars = async (req, res) => {
  try {
    const results = await barService.listBars();
    res.json({ bars: results });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: error.message });
  }
};