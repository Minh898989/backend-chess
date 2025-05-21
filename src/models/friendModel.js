const db = require('../config/db');

const FriendModel = {
  // Tìm user theo userid
  findUserByUserId: async (userid) => {
    const result = await db.query('SELECT * FROM users WHERE userid = $1', [userid]);
    return result.rows[0];
  },

  // Gửi lời mời kết bạn
  sendFriendRequest: async (senderId, receiverId) => {
    await db.query(
      `INSERT INTO friend_requests (sender_id, receiver_id) VALUES ($1, $2)`,
      [senderId, receiverId]
    );
  },

  // Lấy các lời mời kết bạn nhận được
  getFriendRequests: async (userId) => {
    const result = await db.query(
      `SELECT fr.id, u.userid AS from_user, fr.created_at
       FROM friend_requests fr
       JOIN users u ON fr.sender_id = u.id
       WHERE fr.receiver_id = $1 AND fr.status = 'pending'`,
      [userId]
    );
    return result.rows;
  },

  // Cập nhật trạng thái lời mời (accept/reject)
  respondToRequest: async (requestId, action) => {
    const status = action === 'accept' ? 'accepted' : 'rejected';
    const result = await db.query(
      `UPDATE friend_requests SET status = $1 WHERE id = $2 RETURNING *`,
      [status, requestId]
    );
    return result.rows[0];
  },

  // Tạo bản ghi bạn bè khi chấp nhận
  createFriendship: async (user1Id, user2Id) => {
    await db.query(
      `INSERT INTO friends (user1_id, user2_id) VALUES ($1, $2)`,
      [user1Id, user2Id]
    );
  },

  // Tính số ngày đã làm bạn
  getFriendListWithDays: async (userId) => {
    const result = await db.query(
      `SELECT u.userid, f.friend_since, 
              DATE_PART('day', NOW() - f.friend_since) AS days_friends
       FROM friends f
       JOIN users u ON u.id = CASE
           WHEN f.user1_id = $1 THEN f.user2_id
           ELSE f.user1_id
       END
       WHERE $1 IN (f.user1_id, f.user2_id)`,
      [userId]
    );
    return result.rows;
  },
  checkExistingRequest: async (senderId, receiverId) => {
  const result = await db.query(
    `SELECT * FROM friend_requests WHERE sender_id = $1 AND receiver_id = $2 AND status = 'pending'`,
    [senderId, receiverId]
  );
  return result.rows.length > 0;
},

checkAlreadyFriends: async (userId1, userId2) => {
  const result = await db.query(
    `SELECT * FROM friends 
     WHERE (user1_id = $1 AND user2_id = $2) 
        OR (user1_id = $2 AND user2_id = $1)`,
    [userId1, userId2]
  );
  return result.rows.length > 0;
},


  // Kiểm tra đã là bạn chưa

};

module.exports = FriendModel;
