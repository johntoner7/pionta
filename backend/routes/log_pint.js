const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');

router.post('/api/log', logController.logPint);

module.exports = router;