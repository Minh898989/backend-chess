const pool = require("../config/db"); // dùng PostgreSQL

module.exports = {
  searchUsers: async (userid) => {
    const result = await pool.query(
      "SELECT userid, avatar FROM users WHERE userid ILIKE $1 LIMIT 10",
      [`%${userid}%`]
    );
    return result.rows;
  },

  checkExistingRequest: async (senderId, receiverId) => {
    const result = await pool.query(
      "SELECT * FROM friend_requests WHERE (sender_id=$1 AND receiver_id=$2) OR (sender_id=$2 AND receiver_id=$1)",
      [senderId, receiverId]
    );
    return result.rows.length > 0;
  },

  createRequest: async (senderId, receiverId) => {
    await pool.query(
      "INSERT INTO friend_requests (sender_id, receiver_id, status) VALUES ($1, $2, 'pending')",
      [senderId, receiverId]
    );
  },

  respondRequest: async (senderId, receiverId, status) => {
    const result = await pool.query(
      "UPDATE friend_requests SET status=$1 WHERE sender_id=$2 AND receiver_id=$3 AND status='pending'",
      [status, senderId, receiverId]
    );
    return result.rowCount;
  },

  getFriends: async (userId) => {
    const result = await pool.query(
      `
      SELECT u.userid, u.avatar
      FROM users u
      JOIN friend_requests fr
        ON (
          (fr.sender_id = $1 AND fr.receiver_id = u.userid)
          OR
          (fr.receiver_id = $1 AND fr.sender_id = u.userid)
        )
      WHERE fr.status = 'accepted'
      `,
      [userId]
    );
    return result.rows;
  },
   getPendingRequests: async (userId) => {
      const result = await pool.query(
          `
    SELECT fr.sender_id AS userid, u.avatar
    FROM friend_requests fr
    JOIN users u ON u.userid = fr.sender_id
    WHERE fr.receiver_id = $1 AND fr.status = 'pending'
    `,
          [userId]
      );
      return result.rows;
  }


  
};
