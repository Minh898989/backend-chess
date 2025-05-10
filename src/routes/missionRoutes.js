const express = require('express');
const router = express.Router();
const controller = require('../controllers/missionController');

router.get('/:userid', controller.getMissions);
router.post('/claim', controller.claimMission);

module.exports = router;
