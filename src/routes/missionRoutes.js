const express = require('express');
const router = express.Router();
const { getUserMissionsStatus, claimMissionReward } = require('../controllers/missionController');

// Lấy thông tin nhiệm vụ của người chơi
router.get('/missions/user/:userid', getUserMissionsStatus);

// Nhận thưởng cho một nhiệm vụ
router.post('/missions/claim', claimMissionReward);

module.exports = router;
