const pool = require('../config/db');

module.exports = {
  // Tìm kiếm người dùng theo userid
  searchUserByUserId: async (userid) => {
    const result = await pool.query(
      'SELECT userid, avatar FROM users WHERE userid = $1',
      [userid]
    );
    return result.rows[0];
  },

  // Gửi lời mời kết bạn
  sendFriendRequest: async (from_user, to_user) => {
    await pool.query(
      `INSERT INTO friend_requests (from_user, to_user, status)
       VALUES ($1, $2, 'pending')`,
      [from_user, to_user]
    );
  },

  // Kiểm tra lời mời đã tồn tại chưa
  checkExistingRequest: async (from_user, to_user) => {
    const result = await pool.query(
      `SELECT * FROM friend_requests 
       WHERE from_user = $1 AND to_user = $2 AND status = 'pending'`,
      [from_user, to_user]
    );
    return result.rows.length > 0;
  },

  // Chấp nhận lời mời
  acceptFriendRequest: async (from_user, to_user) => {
    await pool.query(
      `UPDATE friend_requests 
       SET status = 'accepted' 
       WHERE from_user = $1 AND to_user = $2`,
      [from_user, to_user]
    );

    // Lưu vào bảng friends
    const [user1, user2] = [from_user, to_user].sort();
    await pool.query(
      `INSERT INTO friends (user1, user2) VALUES ($1, $2)`,
      [user1, user2]
    );
  },

  // Từ chối lời mời
  rejectFriendRequest: async (from_user, to_user) => {
    await pool.query(
      `UPDATE friend_requests 
       SET status = 'rejected' 
       WHERE from_user = $1 AND to_user = $2`,
      [from_user, to_user]
    );
  },

  // Lấy danh sách bạn bè
  getFriends: async (userid) => {
    const result = await pool.query(
      `SELECT 
         CASE 
           WHEN user1 = $1 THEN user2 
           ELSE user1 
         END AS friendid,
         u.avatar, f.friendship_date
       FROM friends f
       JOIN users u ON u.userid = CASE WHEN f.user1 = $1 THEN f.user2 ELSE f.user1 END
       WHERE f.user1 = $1 OR f.user2 = $1`,
      [userid]
    );
    return result.rows;
  }
};
