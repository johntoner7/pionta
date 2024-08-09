const express = require('express');
const router = express.Router();
const pintController = require('../controllers/pintController');

router.post('/api/pint', pintController.addPint);

module.exports = router;