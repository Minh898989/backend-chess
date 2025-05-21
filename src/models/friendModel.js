const db = require('../config/db');

// Tìm người dùng theo userid
const findUserByUserId = async (userid) => {
  const result = await db.query('SELECT * FROM users WHERE userid ILIKE $1', [`%${userid}%`]);
  return result.rows;
};

// Gửi lời mời
const sendFriendRequest = async (senderId, receiverId) => {
  await db.query(
    `INSERT INTO friend_requests (sender_id, receiver_id, status, created_at)
     VALUES ($1, $2, 'pending', CURRENT_TIMESTAMP)`,
    [senderId, receiverId]
  );
};

// Kiểm tra lời mời đang chờ
const checkPendingRequest = async (senderId, receiverId) => {
  const result = await db.query(
    `SELECT * FROM friend_requests
     WHERE sender_id = $1 AND receiver_id = $2 AND status = 'pending'`,
    [senderId, receiverId]
  );
  return result.rows[0];
};

// Chấp nhận / từ chối lời mời
const respondToRequest = async (requestId, status) => {
  await db.query(
    `UPDATE friend_requests SET status = $1 WHERE id = $2`,
    [status, requestId]
  );
};

// Tạo bạn bè nếu đồng ý
const createFriendship = async (user1Id, user2Id) => {
  await db.query(
    `INSERT INTO friendships (user1_id, user2_id, friendship_start)
     VALUES ($1, $2, CURRENT_TIMESTAMP)`,
    [user1Id, user2Id]
  );
};

// Tính số ngày làm bạn
const getFriendshipDuration = async (user1Id, user2Id) => {
  const result = await db.query(
    `SELECT friendship_start FROM friendships 
     WHERE (user1_id = $1 AND user2_id = $2) OR (user1_id = $2 AND user2_id = $1)`,
    [user1Id, user2Id]
  );
  return result.rows[0];
};

module.exports = {
  findUserByUserId,
  sendFriendRequest,
  checkPendingRequest,
  respondToRequest,
  createFriendship,
  getFriendshipDuration
};
