const express = require('express');
const router = express.Router();
const controller = require('../controllers/friendController');

router.get('/search', controller.findFriends); // ?userid=...
router.post('/send', controller.sendRequest);
router.post('/respond', controller.respondRequest);
router.get('/duration/:user1/:user2', controller.friendshipDuration);
router.get('/received/:userId', controller.getReceivedRequests);


module.exports = router;
