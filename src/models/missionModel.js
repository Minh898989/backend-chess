const db = require('../config/db');

const MissionModel = {
  async getAllMissions() {
    return db.any('SELECT * FROM missions');
  },

  async getUserStats(userid) {
    return db.oneOrNone('SELECT * FROM user_stats WHERE userid = $1', [userid]);
  },

  async hasReceivedToday(userid, missionId) {
    return db.oneOrNone(
      'SELECT 1 FROM user_missions WHERE userid = $1 AND mission_id = $2 AND date_completed = CURRENT_DATE',
      [userid, missionId]
    );
  },

  async recordMissionCompletion(userid, missionId) {
    return db.none(
      'INSERT INTO user_missions (userid, mission_id, date_completed) VALUES ($1, $2, CURRENT_DATE)',
      [userid, missionId]
    );
  },

  async addUserPoints(userid, points) {
    await db.none(`
      INSERT INTO user_progress (userid, total_points)
      VALUES ($1, $2)
      ON CONFLICT (userid) DO UPDATE SET total_points = user_progress.total_points + $2
    `, [userid, points]);
  },

  async getUserTotalPoints(userid) {
    const row = await db.one('SELECT total_points FROM user_progress WHERE userid = $1', [userid]);
    return row.total_points;
  },

  async updateUserLevel(userid, level) {
    return db.none('UPDATE user_progress SET level = $1 WHERE userid = $2', [level, userid]);
  }
};

module.exports = MissionModel;
