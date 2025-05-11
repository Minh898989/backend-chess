const express = require('express');
const router = express.Router();
const { claimMissionReward } = require('../controllers/missionController');

router.post('/missions/claim', claimMissionReward);

module.exports = router;
