const express = require('express');
const router = express.Router();
const barController = require('../controllers/barController');

router.post('/api/bar', barController.addBar);

module.exports = router;