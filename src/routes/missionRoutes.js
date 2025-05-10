const express = require('express');
const router = express.Router();
const missionController = require('../controllers/missionController');

router.post('/claim/:userid', missionController.claimAvailableMissions);

module.exports = router;
