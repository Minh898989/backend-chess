const db = require('../config/db');

const MissionModel = {
  // Lấy tất cả nhiệm vụ
  async getAllMissions() {
    return db.any('SELECT * FROM missions');
  },

  // Lấy thông tin stats của người chơi
  async getUserStats(userid) {
    return db.oneOrNone('SELECT * FROM user_stats WHERE userid = $1', [userid]);
  },

  // Lấy các nhiệm vụ đã được nhận hôm nay
  async getUserClaimedMissionIdsToday(userid) {
    const rows = await db.any(
      'SELECT mission_id FROM user_missions WHERE userid = $1 AND date_completed = CURRENT_DATE',
      [userid]
    );
    return rows.map((row) => row.mission_id);
  },

  // Lấy tổng điểm của người chơi
  async getUserTotalPoints(userid) {
    const row = await db.oneOrNone('SELECT total_points FROM user_progress WHERE userid = $1', [userid]);
    return row ? row.total_points : 0;
  },

  // Lấy thông tin một nhiệm vụ theo ID
  async getMissionById(missionId) {
    return db.oneOrNone('SELECT * FROM missions WHERE id = $1', [missionId]);
  },

  // Cập nhật nhiệm vụ đã nhận
  async claimMission(userid, missionId) {
    return db.none('INSERT INTO user_missions (userid, mission_id, date_completed) VALUES ($1, $2, CURRENT_DATE)', [
      userid,
      missionId,
    ]);
  },

  // Cập nhật điểm cho người chơi
  async updateUserPoints(userid, points) {
    return db.none('UPDATE user_progress SET total_points = total_points + $1 WHERE userid = $2', [points, userid]);
  },
};

module.exports = MissionModel;
