const express = require('express');
const router = express.Router();
const { getUserMissionsStatus } = require('../controllers/missionController');

router.get('/missions/user/:userid', getUserMissionsStatus);

module.exports = router;
