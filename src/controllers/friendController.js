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
  const { senderId, receiverId } = req.body; // đang là userid (username)
  try {
    // Lấy id từ userid
    const sender = await FriendModel.findUserByUserId(senderId);
    const receiver = await FriendModel.findUserByUserId(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ message: 'Sender or Receiver not found' });
    }
    const existingRequest = await FriendModel.checkExistingRequest(sender.id, receiver.id);
    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    // Kiểm tra nếu đã là bạn bè
    const alreadyFriends = await FriendModel.checkAlreadyFriends(sender.id, receiver.id);
    if (alreadyFriends) {
      return res.status(400).json({ message: 'You are already friends' });
    }
    
    await FriendModel.sendFriendRequest(sender.id, receiver.id);

    res.json({ message: 'Friend request sent' });
  } catch (err) {
    console.error(err); // debug
    res.status(500).json({ error: err.message });
  }
},


  getRequests: async (req, res) => {
  const { userId } = req.params; // userId ở đây là userid (username)
  try {
    const user = await FriendModel.findUserByUserId(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const requests = await FriendModel.getFriendRequests(user.id); // dùng id thực
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
},



  respondRequest: async (req, res) => {
    const { requestId, action } = req.body;
    try {
      const request = await FriendModel.respondToRequest(requestId, action);
      if (action === 'accept') {
      // Gọi tạo kết bạn 2 chiều
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
    // Tìm theo userid (username) để lấy id
    const user = await FriendModel.findUserByUserId(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Gọi model với id thật
    const friends = await FriendModel.getFriendListWithDays(user.id);
    res.json(friends);
  } catch (err) {
    console.error(err); // Ghi log
    res.status(500).json({ error: err.message });
  }
}

};

module.exports = FriendController;
