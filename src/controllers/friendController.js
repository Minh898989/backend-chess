const FriendModel = require('../models/friendModel');

const FriendController = {
  searchUser: async (req, res) => {
    const { userid } = req.body;
    try {
      const user = await FriendModel.findUserByUserId(userid);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  sendRequest: async (req, res) => {
    const { senderId, receiverId } = req.body;
    try {
      await FriendModel.sendFriendRequest(senderId, receiverId);
      res.json({ message: 'Friend request sent' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getRequests: async (req, res) => {
    const { userId } = req.params;
    try {
      const requests = await FriendModel.getFriendRequests(userId);
      res.json(requests);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  respondRequest: async (req, res) => {
    const { requestId, action } = req.body;
    try {
      const request = await FriendModel.respondToRequest(requestId, action);
      if (action === 'accept') {
        await FriendModel.createFriendship(request.sender_id, request.receiver_id);
      }
      res.json({ message: `Friend request ${action}ed` });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getFriendList: async (req, res) => {
    const { userId } = req.params;
    try {
      const friends = await FriendModel.getFriendListWithDays(userId);
      res.json(friends);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = FriendController;
