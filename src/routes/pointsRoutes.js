const express = require('express');
const router = express.Router();
const { resign } = require('../controllers/pointsController');

router.post('/resign', resign);

module.exports = router;
