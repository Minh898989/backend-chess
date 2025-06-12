const friendModel = require('../models/friendModel');

module.exports = {
  searchUser: async (req, res) => {
    try {
      const { userid } = req.params;
      const user = await friendModel.searchUserByUserId(userid);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  sendRequest: async (req, res) => {
    try {
      const { from_user, to_user } = req.body;
      if (from_user === to_user) return res.status(400).json({ message: "Can't add yourself" });

      const exists = await friendModel.checkExistingRequest(from_user, to_user);
      if (exists) return res.status(400).json({ message: 'Request already sent' });

      await friendModel.sendFriendRequest(from_user, to_user);

      res.json({ message: 'Friend request sent' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  acceptRequest: async (req, res) => {
    try {
      const { from_user, to_user } = req.body;
      await friendModel.acceptFriendRequest(from_user, to_user);
      res.json({ message: 'Friend request accepted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  rejectRequest: async (req, res) => {
    try {
      const { from_user, to_user } = req.body;
      await friendModel.rejectFriendRequest(from_user, to_user);
      res.json({ message: 'Friend request rejected' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getFriendsList: async (req, res) => {
    try {
      const { userid } = req.params;
      const friends = await friendModel.getFriends(userid);
      res.json(friends);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  getPendingRequests: async (req, res) => {
  try {
    const { userid } = req.params;
    const requests = await friendModel.getPendingRequestsForUser(userid);
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
},

};
