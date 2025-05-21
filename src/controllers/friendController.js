const friendModel = require('../models/friendModel');
const db = require('../config/db');

// Tìm bạn
const findFriends = async (req, res) => {
  const { userid } = req.query;
  const users = await friendModel.findUserByUserId(userid);
  res.json(users);
};

// Gửi lời mời
const sendRequest = async (req, res) => {
  const { senderId, receiverId } = req.body;

  if (senderId === receiverId)
    return res.status(400).json({ message: 'Không thể tự gửi lời mời cho chính mình' });

  const exists = await friendModel.checkPendingRequest(senderId, receiverId);
  if (exists)
    return res.status(400).json({ message: 'Đã gửi lời mời trước đó' });

  await friendModel.sendFriendRequest(senderId, receiverId);
  res.json({ message: 'Đã gửi lời mời kết bạn' });
};

// Phản hồi lời mời
const respondRequest = async (req, res) => {
  const { requestId, status } = req.body;

  const result = await db.query(
    'SELECT sender_id, receiver_id FROM friend_requests WHERE id = $1',
    [requestId]
  );
  const { sender_id, receiver_id } = result.rows[0];

  if (status === 'accepted') {
    await friendModel.createFriendship(sender_id, receiver_id);
  }

  await friendModel.respondToRequest(requestId, status);
  res.json({ message: `Lời mời đã được ${status}` });
};

// Tính số ngày tri kỷ
const friendshipDuration = async (req, res) => {
  const { user1, user2 } = req.params;
  const data = await friendModel.getFriendshipDuration(user1, user2);

  if (!data) return res.status(404).json({ message: 'Chưa là bạn bè' });

  const days = Math.floor((new Date() - new Date(data.friendship_start)) / (1000 * 60 * 60 * 24));
  res.json({ days, message: `Đã là bạn bè ${days} ngày` });
};

module.exports = {
  findFriends,
  sendRequest,
  respondRequest,
  friendshipDuration
};
