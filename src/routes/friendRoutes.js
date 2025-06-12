const express = require('express');
const router = express.Router();
const controller = require('../controllers/friendController');

// Middleware giả lập đăng nhập
router.use((req, res, next) => {
  req.user = { userid: 'user_a' }; // thay bằng userid thực tế khi có auth
  next();
});

router.get('/search', controller.searchUsers);
router.post('/request', controller.sendRequest);
router.post('/accept', controller.acceptRequest);
router.get('/list', controller.listFriends);

module.exports = router;
