const express = require('express');
const router = express.Router();
const FriendController = require('../controllers/friendController');

router.post('/search', FriendController.searchUser); // Tìm user theo userid
router.post('/send-request', FriendController.sendRequest); // Gửi lời mời
router.get('/requests/:userId', FriendController.getRequests); // Lời mời nhận được
router.post('/respond', FriendController.respondRequest); // Chấp nhận / từ chối
router.get('/friends/:userId', FriendController.getFriendList); // Danh sách bạn bè & số ngày

module.exports = router;
