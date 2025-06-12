const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendController');

router.get('/search/:userid', friendController.searchUser);
router.post('/request', friendController.sendRequest);
router.post('/accept', friendController.acceptRequest);
router.post('/reject', friendController.rejectRequest);
router.get('/friends/:userid', friendController.getFriendsList);
router.get('/requests/:userid', friendController.getPendingRequests);
router.get('/sent/:userid', friendController.getSentRequests);

module.exports = router;
