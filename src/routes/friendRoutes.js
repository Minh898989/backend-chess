const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendController');


// Tìm bạn
router.get('/search', friendController.searchUsers);

// Gửi lời mời kết bạn
router.post('/request', friendController.sendRequest);

// Chấp nhận / từ chối
router.post('/respond', friendController.respondRequest);

// Lấy danh sách bạn bè
router.get('/friends', friendController.getFriends);

// Lấy danh sách lời mời đang chờ
router.get('/requests', friendController.getPending);

module.exports = router;
