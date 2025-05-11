const db = require('../config/db');

const getAllMissions = async () => {
  const res = await db.query('SELECT * FROM missions ORDER BY id ASC');
  return res.rows;
};

const getUserStats = async (userId) => {
  const res = await db.query('SELECT * FROM user_stats WHERE userid = $1', [userId]);
  return res.rows[0];
};
const getTotalClaimedPoints = async (userId) => {
  const res = await db.query(`
    SELECT COALESCE(points, 0) AS total
    FROM users
    WHERE userid = $1
  `, [userId]);
  return res.rows.length ? res.rows[0].total : 0;
};

const checkClaimed = async (userId, missionId) => {
  const res = await db.query('SELECT * FROM user_missions WHERE userid = $1 AND mission_id = $2', [userId, missionId]);
  return res.rowCount > 0;
};

const claimReward = async (userId, missionId, rewardPoints) => {
  await db.query('INSERT INTO user_missions(userid, mission_id, claimed_at) VALUES ($1, $2, NOW())', [userId, missionId]);
  await db.query('UPDATE users SET points = points + $1 WHERE userid = $2', [rewardPoints, userId]);
};

module.exports = {
  getAllMissions,
  getUserStats,
  checkClaimed,
  claimReward,
  getTotalClaimedPoints,
};
