const express = require("express");
const router = express.Router();
const friendController = require("../controllers/friendController");

router.get("/search", friendController.searchUsers);         // Tìm người dùng theo userid
router.post("/request", friendController.sendRequest);       // Gửi lời mời kết bạn
router.post("/respond", friendController.respondToRequest);  // Chấp nhận/từ chối
router.get("/list/:userId", friendController.getFriends);    // Lấy danh sách bạn bè

module.exports = router;
