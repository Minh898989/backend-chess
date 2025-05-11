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
  const res = await db.query('SELECT COALESCE(points, 0) AS total FROM users WHERE userid = $1', [userId]);
  return res.rows[0]?.total || 0;
};

const checkClaimed = async (userId, missionId) => {
  const today = new Date().toISOString().split('T')[0];
  const res = await db.query(
    'SELECT 1 FROM user_missions WHERE userid = $1 AND mission_id = $2 AND claimed_date = $3',
    [userId, missionId, today]
  );
  return res.rowCount > 0;
};

const claimReward = async (userId, missionId, rewardPoints) => {
  const today = new Date().toISOString().split('T')[0];
  try {
    await db.query('BEGIN');

    await db.query(
      'INSERT INTO user_missions(userid, mission_id, claimed_at, claimed_date) VALUES ($1, $2, NOW(), $3)',
      [userId, missionId, today]
    );

    await db.query(
      'UPDATE users SET points = points + $1 WHERE userid = $2',
      [rewardPoints, userId]
    );

    await db.query('COMMIT');
  } catch (err) {
    await db.query('ROLLBACK');
    if (err.code === '23505') {
      throw new Error('Bạn đã nhận thưởng nhiệm vụ này hôm nay rồi');
    }
    throw err;
  }
};

module.exports = {
  getAllMissions,
  getUserStats,
  getTotalClaimedPoints,
  checkClaimed,
  claimReward,
};
