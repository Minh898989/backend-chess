// GET /missions/user/:userid
const MissionModel = require('../models/missionModel');  // Import đúng mô-đun MissionModel

async function getUserMissionsStatus(req, res) {
  try {
    const { userid } = req.params;  // userid là tên người dùng

    // Lấy tất cả nhiệm vụ, stats người chơi, nhiệm vụ đã nhận hôm nay, và tổng điểm
    const [missions, stats, claimedToday, totalPoints] = await Promise.all([
      MissionModel.getAllMissions(),
      MissionModel.getUserStats(userid),  // Sử dụng userid là tên
      MissionModel.getUserClaimedMissionIdsToday(userid),
      MissionModel.getUserTotalPoints(userid),
    ]);

    if (!stats) return res.status(404).json({ error: 'User stats not found.' });

    const enrichedMissions = missions.map((mission) => {
      let isCompleted = false;

      switch (mission.id) {
        case 1: isCompleted = true; break;
        case 2: isCompleted = stats.games_played >= 5; break;
        case 3: isCompleted = stats.games_won >= 3; break;
        case 4: isCompleted = stats.total_minutes >= 10; break;
        case 5: isCompleted = stats.total_captured >= 10; break;
        default: isCompleted = false;
      }

      return {
        ...mission,
        isCompleted,
        isClaimedToday: claimedToday.includes(mission.id),
      };
    });

    res.json({ missions: enrichedMissions, totalPoints });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

// POST /missions/claim
async function claimMissionReward(req, res) {
  try {
    const { userid, missionId } = req.body;  // userid là tên người dùng

    const [mission, stats, claimedToday] = await Promise.all([
      MissionModel.getMissionById(missionId),
      MissionModel.getUserStats(userid),  // Sử dụng userid là tên
      MissionModel.getUserClaimedMissionIdsToday(userid),
    ]);

    if (!mission) return res.status(404).json({ error: 'Mission not found.' });
    if (claimedToday.includes(missionId)) return res.status(400).json({ error: 'Mission already claimed today.' });

    let isCompleted = false;
    switch (mission.id) {
      case 1: isCompleted = true; break;
      case 2: isCompleted = stats.games_played >= 5; break;
      case 3: isCompleted = stats.games_won >= 3; break;
      case 4: isCompleted = stats.total_minutes >= 10; break;
      case 5: isCompleted = stats.total_captured >= 10; break;
      default: isCompleted = false;
    }

    if (!isCompleted) {
      return res.status(400).json({ error: 'Mission not completed yet.' });
    }

    await Promise.all([
      MissionModel.claimMission(userid, missionId),
      MissionModel.updateUserPoints(userid, mission.reward_points),
    ]);

    res.json({ message: 'Mission completed and reward claimed successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

module.exports = { getUserMissionsStatus, claimMissionReward };
