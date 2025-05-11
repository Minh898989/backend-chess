const db = require('../config/db');

const MissionModel = {
  async getAllMissions() {
    return db.any('SELECT * FROM missions');
  },

  async getUserStats(userid) {
    return db.oneOrNone('SELECT * FROM user_stats WHERE userid = $1', [userid]);
  },

  async getUserClaimedMissionIdsToday(userid) {
    const rows = await db.any(
      'SELECT mission_id FROM user_missions WHERE userid = $1 AND date_completed = CURRENT_DATE',
      [userid]
    );
    return rows.map(row => row.mission_id);
  },

  async getUserTotalPoints(userid) {
    const row = await db.oneOrNone('SELECT total_points FROM user_progress WHERE userid = $1', [userid]);
    return row ? row.total_points : 0;
  }
};

module.exports = MissionModel;
