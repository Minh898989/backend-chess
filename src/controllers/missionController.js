const missionModel = require('../models/missionModel');
const userStatsModel = require('../models/userStatsModel');
const userMissionModel = require('../models/userMissionModel');

exports.claimAvailableMissions = async (req, res) => {
  const { userid } = req.params;
  const stats = await userStatsModel.getStatsByUserId(userid);
  const missions = await missionModel.getAllMissions();

  const claimable = [];

  for (const mission of missions) {
    const alreadyClaimed = await userMissionModel.isMissionClaimed(userid, mission.id);
    if (alreadyClaimed) continue;

    let eligible = false;
    switch (mission.id) {
      case 1: eligible = true; break; // Đăng nhập mỗi ngày
      case 2: eligible = stats.games_played >= 5; break;
      case 3: eligible = stats.games_won >= 3; break;
      case 4: eligible = stats.total_minutes >= 10; break;
      case 5: eligible = stats.total_captured >= 10; break;
    }

    if (eligible) {
      await userMissionModel.claimMission(userid, mission.id);
      claimable.push({ missionId: mission.id, reward: mission.reward_points });
    }
  }

  res.json({ claimed: claimable });
};
