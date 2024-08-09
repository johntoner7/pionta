const pintService = require('../services/pintService');

exports.addPint = async (req, res) => {
  const { pintName, barName, price } = req.body;

  if (!pintName || !barName || price === null) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pintService.addPint(pintName, barName, price);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.logPint = async (req, res) => {
  const { pintName, barName, rating, description} = req.body;

  if (!pintName || !barName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pintService.logPint(pintName, barName, rating, description);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}