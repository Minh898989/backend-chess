const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

router.post('/update', statsController.updateStats);
router.get('/:userid', statsController.getStats);

module.exports = router;
