const express = require('express');
const router = express.Router();
const barController = require('../controllers/barController');

router.get('/api/bars', barController.listBars);

module.exports = router;