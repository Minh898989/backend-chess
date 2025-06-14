const friendModel = require("../models/friendModel");

module.exports = {
  searchUsers: async (req, res) => {
    const { userid } = req.query;
    try {
      const users = await friendModel.searchUsers(userid);
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: "Lỗi khi tìm kiếm người dùng" });
    }
  },

  sendRequest: async (req, res) => {
    const { sender_id, receiver_id } = req.body;
    try {
      if (sender_id === receiver_id)
        return res.status(400).json({ error: "Không thể kết bạn với chính mình" });

      const exists = await friendModel.checkExistingRequest(sender_id, receiver_id);
      if (exists)
        return res.status(400).json({ error: "Đã tồn tại lời mời hoặc đã là bạn bè" });

      await friendModel.createRequest(sender_id, receiver_id);
      res.json({ message: "Đã gửi lời mời kết bạn thành công" });
    } catch (err) {
      res.status(500).json({ error: "Lỗi khi gửi lời mời kết bạn" });
    }
  },

  respondToRequest: async (req, res) => {
    const { sender_id, receiver_id, action } = req.body;
    try {
      if (!["accept", "decline"].includes(action))
        return res.status(400).json({ error: "Hành động không hợp lệ" });

      const status = action === "accept" ? "accepted" : "declined";
      const updated = await friendModel.respondRequest(sender_id, receiver_id, status);

      if (updated === 0)
        return res.status(400).json({ error: "Không tìm thấy lời mời phù hợp" });

      res.json({ message: `Đã ${action === "accept" ? "chấp nhận" : "từ chối"} lời mời kết bạn thành công` });
    } catch (err) {
      res.status(500).json({ error: "Lỗi khi phản hồi lời mời kết bạn" });
    }
  },

  getFriends: async (req, res) => {
    const { userId } = req.params;
    try {
      const friends = await friendModel.getFriends(userId);
      res.json(friends);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách bạn bè:", err); 
      res.status(500).json({ error: "Lỗi khi lấy danh sách bạn bè" });
    }
  },

  getPendingRequests: async (req, res) => {
    const { userId } = req.params;
    try {
      const requests = await friendModel.getPendingRequests(userId);
      console.log('Danh sách lời mời kết bạn cho người dùng', userId, ':', requests);
      res.json(requests);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách lời mời:", err);
      res.status(500).json({ error: "Lỗi khi lấy danh sách lời mời kết bạn" });
    }
  }
};
