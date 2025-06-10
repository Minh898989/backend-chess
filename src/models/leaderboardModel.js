
const pool = require('../config/db');

const getLeaderboard = async () => {
  const result = await pool.query(
    `SELECT id, userid, total_points, level, avatar
     FROM users
     ORDER BY total_points DESC
     LIMIT 100`
  );
  return result.rows;
};

module.exports = {
  getLeaderboard
};
