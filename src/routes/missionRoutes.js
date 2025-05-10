const express = require("express");
const router = express.Router();
const missionController = require("../controllers/missionController");

router.get("/:userId", missionController.getClaimedMissions);
router.post("/:userId/claim", missionController.claimMission);

module.exports = router;
