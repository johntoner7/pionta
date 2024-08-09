const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');

router.get('/api/logs', logController.listPintLogs);

module.exports = router;