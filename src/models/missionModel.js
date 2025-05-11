// src/models/missionModel.js

const db = require('../config/db'); // đường dẫn đến file cấu hình pool

const getAllMissions = async () => {
  const result = await db.query('SELECT * FROM missions');
  return result.rows;
};

const getMissionById = async (id) => {
  const result = await db.query('SELECT * FROM missions WHERE id = $1', [id]);
  return result.rows[0];
};

const getUserStats = async (userid) => {
  const result = await db.query('SELECT * FROM user_stats WHERE userid = $1', [userid]);
  return result.rows[0];
};

const getUserClaimedMissionIdsToday = async (userid) => {
  const result = await db.query(`
    SELECT mission_id FROM claimed_missions
WHERE userid = $1 AND DATE(claimed_at) = CURRENT_DATE

  `, [userid]);
  return result.rows.map(r => r.mission_id);
};

const getUserTotalPoints = async (userid) => {
  const result = await db.query('SELECT total_points FROM users WHERE userid = $1', [userid]);
  return result.rows[0]?.total_points || 0;
};

const claimMission = async (userid, missionId) => {
  await db.query(`
    INSERT INTO claimed_missions (userid, mission_id, claimed_at)
    VALUES ($1, $2, CURRENT_TIMESTAMP)
  `, [userid, missionId]);
};


const updateUserPoints = async (userid, points) => {
  await db.query(`
    UPDATE users SET total_points = total_points + $1 WHERE userid = $2
  `, [points, userid]);
};

module.exports = {
  getAllMissions,
  getMissionById,
  getUserStats,
  getUserClaimedMissionIdsToday,
  getUserTotalPoints,
  claimMission,
  updateUserPoints
};
