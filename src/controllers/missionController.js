const model = require('../models/missionModel');

const missionConditions = {
  1: (stats) => true,
  2: (stats) => stats.games_played >= 5,
  3: (stats) => stats.games_won >= 3,
  4: (stats) => stats.total_minutes >= 10,
  5: (stats) => stats.total_captured >= 10,
};

exports.getMissions = async (req, res) => {
  const userId = req.params.userid;
  const missions = await model.getAllMissions();
  const stats = await model.getUserStats(userId);
  const totalPoints = await model.getTotalClaimedPoints(userId);

  const result = await Promise.all(missions.map(async (m) => {
    const isEligible = missionConditions[m.id] ? missionConditions[m.id](stats) : false;
    const claimed = await model.checkClaimed(userId, m.id);
    return {
      ...m,
      eligible: isEligible,
      claimed
    };
  }));

  res.json({ missions: result, totalPoints });
};

exports.claimMission = async (req, res) => {
  const { userid, missionId } = req.body;
  const missions = await model.getAllMissions();
  const mission = missions.find(m => m.id === missionId);
  const stats = await model.getUserStats(userid);

  const isEligible = missionConditions[missionId](stats);
  const alreadyClaimed = await model.checkClaimed(userid, missionId);

  if (!isEligible) return res.status(400).json({ message: 'Chưa đủ điều kiện nhận thưởng' });
  if (alreadyClaimed) return res.status(400).json({ message: 'Đã nhận thưởng rồi' });

  await model.claimReward(userid, missionId, mission.reward_points);
  res.json({ message: 'Nhận thưởng thành công!' });
};
