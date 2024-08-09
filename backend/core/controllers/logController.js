const logService = require('../services/logService');

exports.logPint = async (req, res) => {
  const { pintName, barId, rating, description} = req.body;
  if (!pintName || !barId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await logService.logPint(pintName, barId, rating, description);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.listPintLogs = async (req, res) => {
  try {
    const result = await logService.listPintLogs();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}