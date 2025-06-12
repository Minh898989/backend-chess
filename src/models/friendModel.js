const pool = require('../config/db');

module.exports = {
  async searchUsers(keyword, currentUserId) {
    const result = await pool.query(
      `SELECT userid, avatar FROM users 
       WHERE userid != $1 AND userid ILIKE $2`,
      [currentUserId, `%${keyword}%`]
    );
    return result.rows;
  },

  async sendFriendRequest(fromId, toId) {
    const result = await pool.query(
      `SELECT * FROM friends WHERE 
       (user1 = $1 AND user2 = $2) OR (user1 = $2 AND user2 = $1)`,
      [fromId, toId]
    );
    if (result.rows.length > 0) return { error: 'Đã gửi hoặc là bạn rồi' };

    await pool.query(
      `INSERT INTO friends (user1, user2, status) 
       VALUES ($1, $2, 'pending')`,
      [fromId, toId]
    );
    return { success: true };
  },

  async acceptFriendRequest(fromId, toId) {
    await pool.query(
      `UPDATE friends 
       SET status = 'accepted', accepted_at = CURRENT_TIMESTAMP 
       WHERE user1 = $1 AND user2 = $2 AND status = 'pending'`,
      [fromId, toId]
    );
  },

  async getFriendsWithDays(userId) {
    const result = await pool.query(
      `SELECT 
        u.userid, u.avatar,
        EXTRACT(DAY FROM NOW() - f.accepted_at) AS days
      FROM friends f
      JOIN users u ON u.userid = CASE 
        WHEN f.user1 = $1 THEN f.user2 
        ELSE f.user1 END
      WHERE (f.user1 = $1 OR f.user2 = $1) AND f.status = 'accepted'`,
      [userId]
    );
    return result.rows;
  }
};
