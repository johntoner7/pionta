const barService = require('../services/barService');

exports.listBars = async (req, res) => {
  try {
    const results = await barService.listBars();
    res.json({ bars: results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};