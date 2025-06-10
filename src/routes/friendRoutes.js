const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendController');
const auth = require('../middlewares/auth');

// Tìm bạn
router.get('/search', auth, friendController.searchUsers);

// Gửi lời mời kết bạn
router.post('/request', auth, friendController.sendRequest);

// Chấp nhận / từ chối
router.post('/respond', auth, friendController.respondRequest);

// Lấy danh sách bạn bè
router.get('/friends', auth, friendController.getFriends);

// Lấy danh sách lời mời đang chờ
router.get('/requests', auth, friendController.getPending);

module.exports = router;
