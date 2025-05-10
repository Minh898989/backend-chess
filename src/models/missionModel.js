const pool = require("../config/db");

const MissionModel = {
  async getClaimedMissions(userId, date) {
    const res = await pool.query(
      `SELECT mission_id FROM user_missions WHERE user_id = $1 AND date_claimed = $2`,
      [userId, date]
    );
    return res.rows.map(row => row.mission_id);
  },

  async claimMission(userId, missionId, date) {
    return await pool.query(
      `INSERT INTO user_missions (user_id, mission_id, date_claimed)
       VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
      [userId, missionId, date]
    );
  }
};

module.exports = MissionModel;
