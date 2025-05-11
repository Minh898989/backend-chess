const express = require('express');
const router = express.Router();
const { getUserMissionsStatus, claimMissionReward } = require('../controllers/missionController');

// Dùng userid thay vì username
router.get('/missions/user/:userid', getUserMissionsStatus);  // Sửa từ :username thành :userid
router.post('/missions/claim', claimMissionReward);  // POST giữ nguyên

module.exports = router;
