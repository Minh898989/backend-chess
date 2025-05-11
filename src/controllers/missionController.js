const model = require('../models/missionModel');
const db = require('../config/db');

const missionConditions = {
  1: (stats) => true,
  2: (stats) => stats.games_played >= 5,
  3: (stats) => stats.games_won >= 3,
  4: (stats) => stats.total_minutes >= 10,
  5: (stats) => stats.total_captured >= 10,
};

const resetDailyMissionsIfNeeded = async (userId) => {
  const res = await db.query('SELECT last_reset FROM users WHERE userid = $1', [userId]);
  const lastReset = res.rows[0]?.last_reset;
  const today = new Date().toISOString().split('T')[0];

  if (lastReset !== today) {
    await db.query('DELETE FROM user_missions WHERE userid = $1', [userId]);
    await db.query('UPDATE users SET last_reset = $1 WHERE userid = $2', [today, userId]);
  }
};

exports.getMissions = async (req, res) => {
  try {
    const userId = req.params.userid;
    await resetDailyMissionsIfNeeded(userId);

    const missions = await model.getAllMissions();
    const stats = await model.getUserStats(userId);
    const totalPoints = await model.getTotalClaimedPoints(userId);

    const level = totalPoints >= 100 ? 3 : totalPoints >= 30 ? 2 : 1;

    const results = await Promise.all(missions.map(async (m) => {
      const eligible = missionConditions[m.id]?.(stats) || false;
      const claimed = await model.checkClaimed(userId, m.id);
      return { ...m, eligible, claimed };
    }));

    res.json({ missions: results, totalPoints, level });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

exports.claimMission = async (req, res) => {
  try {
    const { userid, missionId } = req.body;

    const missions = await model.getAllMissions();
    const mission = missions.find(m => m.id === missionId);
    if (!mission) return res.status(400).json({ message: 'Nhiệm vụ không tồn tại' });

    const stats = await model.getUserStats(userid);
    const eligible = missionConditions[missionId]?.(stats) || false;
    if (!eligible) return res.status(400).json({ message: 'Chưa đủ điều kiện nhận thưởng' });

    const claimed = await model.checkClaimed(userid, missionId);
    if (claimed) return res.status(400).json({ message: 'Bạn đã nhận thưởng nhiệm vụ này hôm nay rồi' });

    await model.claimReward(userid, missionId, mission.reward_points);
    res.json({ message: 'Nhận thưởng thành công!' });
  } catch (err) {
    res.status(400).json({ message: err.message || 'Lỗi khi nhận thưởng' });
  }
};
