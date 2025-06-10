const FriendModel = require('../models/FriendModel');

exports.searchUsers = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const currentUserId = req.user.userid;

    const users = await FriendModel.searchUsers(keyword, currentUserId);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Search failed', details: error.message });
  }
};

exports.sendRequest = async (req, res) => {
  try {
    const senderId = req.user.userid;
    const { receiverId } = req.body;

    if (senderId === receiverId) {
      return res.status(400).json({ error: 'Cannot send request to yourself' });
    }

    const request = await FriendModel.sendFriendRequest(senderId, receiverId);
    res.json({ message: 'Request sent', request });
  } catch (error) {
    res.status(500).json({ error: 'Send request failed', details: error.message });
  }
};

exports.respondRequest = async (req, res) => {
  try {
    const { requestId, status } = req.body;

    const result = await FriendModel.respondToRequest(requestId, status);
    res.json({ message: `Request ${status}`, result });
  } catch (error) {
    res.status(500).json({ error: 'Respond failed', details: error.message });
  }
};

exports.getFriends = async (req, res) => {
  try {
    const userId = req.user.userid;
    const friends = await FriendModel.getFriends(userId);
    res.json(friends);
  } catch (error) {
    res.status(500).json({ error: 'Get friends failed', details: error.message });
  }
};

exports.getPending = async (req, res) => {
  try {
    const userId = req.user.userid;
    const requests = await FriendModel.getPendingRequests(userId);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Get pending requests failed', details: error.message });
  }
};
