const friendModel = require('../models/friendModel');

module.exports = {
  async searchUsers(req, res) {
    const { keyword } = req.query;
    const currentUserId = req.user.userid;
    const result = await friendModel.searchUsers(keyword, currentUserId);
    res.json(result);
  },

  async sendRequest(req, res) {
    const { toId } = req.body;
    const fromId = req.user.userid;
    const result = await friendModel.sendFriendRequest(fromId, toId);
    res.json(result);
  },

  async acceptRequest(req, res) {
    const { fromId } = req.body;
    const toId = req.user.userid;
    await friendModel.acceptFriendRequest(fromId, toId);
    res.json({ success: true });
  },

  async listFriends(req, res) {
    const userId = req.user.userid;
    const list = await friendModel.getFriendsWithDays(userId);
    res.json(list);
  }
};
