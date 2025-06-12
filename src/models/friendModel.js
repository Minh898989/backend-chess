const pool = require('../config/db');

module.exports = {
  searchUserByUserId: async (userid) => {
    const result = await pool.query(
      'SELECT userid, avatar FROM users WHERE userid = $1',
      [userid]
    );
    return result.rows[0];
  },

  sendFriendRequest: async (from_user, to_user) => {
    await pool.query(
      `INSERT INTO friend_requests (from_user, to_user, status)
       VALUES ($1, $2, 'pending')`,
      [from_user, to_user]
    );
  },

  checkExistingRequest: async (from_user, to_user) => {
    const result = await pool.query(
      `SELECT * FROM friend_requests 
       WHERE ((from_user = $1 AND to_user = $2) OR (from_user = $2 AND to_user = $1)) 
       AND status = 'pending'`,
      [from_user, to_user]
    );
    return result.rows.length > 0;
  },

  acceptFriendRequest: async (from_user, to_user) => {
    await pool.query(
      `UPDATE friend_requests 
       SET status = 'accepted' 
       WHERE from_user = $1 AND to_user = $2`,
      [from_user, to_user]
    );

    const [user1, user2] = [from_user, to_user].sort();
    await pool.query(
      `INSERT INTO friends (user1, user2) VALUES ($1, $2)`,
      [user1, user2]
    );
  },

  rejectFriendRequest: async (from_user, to_user) => {
    await pool.query(
      `UPDATE friend_requests 
       SET status = 'rejected' 
       WHERE from_user = $1 AND to_user = $2`,
      [from_user, to_user]
    );
  },

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
  },

  getPendingRequestsForUser: async (userid) => {
    const result = await pool.query(
      `SELECT fr.from_user, u.avatar
       FROM friend_requests fr
       JOIN users u ON fr.from_user = u.userid
       WHERE fr.to_user = $1 AND fr.status = 'pending'`,
      [userid]
    );
    return result.rows;
  },

  getSentRequestsForUser: async (userid) => {
    const result = await pool.query(
      `SELECT fr.to_user, u.avatar
       FROM friend_requests fr
       JOIN users u ON fr.to_user = u.userid
       WHERE fr.from_user = $1 AND fr.status = 'pending'`,
      [userid]
    );
    return result.rows;
  },
};
