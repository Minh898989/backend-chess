const MissionModel = require('../models/missionModel');

const LEVEL_STEP = 100;

function calculateLevel(points) {
  return Math.floor(points / LEVEL_STEP) + 1;
}

async function claimMissionReward(req, res) {
  try {
    const { userid, missionId } = req.body;
    const missionList = await MissionModel.getAllMissions();
    const mission = missionList.find(m => m.id === missionId);

    if (!mission) return res.status(404).json({ error: 'Mission not found.' });

    // Check if already claimed today
    const alreadyClaimed = await MissionModel.hasReceivedToday(userid, missionId);
    if (alreadyClaimed) {
      return res.status(400).json({ error: 'Reward already claimed today for this mission.' });
    }

    // Check if user meets mission condition
    const stats = await MissionModel.getUserStats(userid);
    if (!stats) return res.status(404).json({ error: 'User stats not found.' });

    let isCompleted = false;

    switch (missionId) {
      case 1:
        isCompleted = true; // Daily login
        break;
      case 2:
        isCompleted = stats.games_played >= 5;
        break;
      case 3:
        isCompleted = stats.games_won >= 3;
        break;
      case 4:
        isCompleted = stats.total_minutes >= 10;
        break;
      case 5:
        isCompleted = stats.total_captured >= 10;
        break;
    }

    if (!isCompleted) {
      return res.status(400).json({ error: 'Mission not yet completed.' });
    }

    // Reward
    await MissionModel.recordMissionCompletion(userid, missionId);
    await MissionModel.addUserPoints(userid, mission.reward_points);

    const totalPoints = await MissionModel.getUserTotalPoints(userid);
    const newLevel = calculateLevel(totalPoints);
    await MissionModel.updateUserLevel(userid, newLevel);

    res.json({ message: 'Reward claimed successfully.', totalPoints, level: newLevel });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

module.exports = { claimMissionReward };
