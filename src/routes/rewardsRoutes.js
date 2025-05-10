const express = require("express");
const router = express.Router();
const rewardsController = require("../controllers/rewardsController");

router.get("/:userId", rewardsController.getRewardPoints);
router.post("/:userId/add", rewardsController.addRewardPoints);

module.exports = router;
