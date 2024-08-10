const express = require('express');
const router = express.Router();
const barController = require('../controllers/barController');

router.get('/api/bar', barController.listBars);

module.exports = router;