const db = require('../config/db');

class FriendModel {
  // Tìm người dùng khác (gợi ý tìm bạn)
  static async searchUsers(keyword, currentUserId) {
    const query = `
      SELECT userid FROM users
      WHERE userid ILIKE $1 AND userid != $2
    `;
    const values = [`%${keyword}%`, currentUserId];
    const result = await db.query(query, values);
    return result.rows;
  }

  // Gửi lời mời kết bạn
  static async sendFriendRequest(senderId, receiverId) {
    const query = `
      INSERT INTO friend_requests (sender_id, receiver_id)
      VALUES ($1, $2)
      RETURNING *
    `;
    const values = [senderId, receiverId];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  // Chấp nhận hoặc từ chối lời mời
  static async respondToRequest(requestId, status) {
    let query, values;
    if (status === 'accepted') {
      query = `
        UPDATE friend_requests
        SET status = 'accepted', accepted_at = NOW()
        WHERE id = $1
        RETURNING *
      `;
      values = [requestId];
    } else {
      query = `
        UPDATE friend_requests
        SET status = $1
        WHERE id = $2
        RETURNING *
      `;
      values = [status, requestId];
    }
    const result = await db.query(query, values);
    return result.rows[0];
  }

  // Lấy danh sách bạn bè + số ngày đã làm bạn
  static async getFriends(userId) {
    const query = `
      SELECT 
        CASE
          WHEN sender_id = $1 THEN receiver_id
          ELSE sender_id
        END AS friend_id,
        accepted_at,
        NOW()::date - accepted_at::date AS days_of_friendship
      FROM friend_requests
      WHERE (sender_id = $1 OR receiver_id = $1)
        AND status = 'accepted'
    `;
    const values = [userId];
    const result = await db.query(query, values);
    return result.rows;
  }

  // Lấy danh sách lời mời kết bạn đang chờ
  static async getPendingRequests(userId) {
    const query = `
      SELECT fr.id, u.userid AS sender
      FROM friend_requests fr
      JOIN users u ON u.userid = fr.sender_id
      WHERE fr.receiver_id = $1 AND fr.status = 'pending'
    `;
    const values = [userId];
    const result = await db.query(query, values);
    return result.rows;
  }
}

module.exports = FriendModel;
