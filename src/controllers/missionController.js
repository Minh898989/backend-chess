const MissionModel = require('../models/missionModel');

// GET /missions/user/:userid
async function getUserMissionsStatus(req, res) {
  try {
    const { userid } = req.params;

    const [missions, stats, claimedToday, totalPoints] = await Promise.all([
      MissionModel.getAllMissions(),
      MissionModel.getUserStats(userid),
      MissionModel.getUserClaimedMissionIdsToday(userid),
      MissionModel.getUserTotalPoints(userid)
    ]);

    if (!stats) return res.status(404).json({ error: 'User stats not found.' });

    const enrichedMissions = missions.map(mission => {
      let isCompleted = false;

      switch (mission.id) {
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
        default:
          isCompleted = false;
      }

      return {
        ...mission,
        isCompleted,
        isClaimedToday: claimedToday.includes(mission.id)
      };
    });

    res.json({ missions: enrichedMissions, totalPoints });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

module.exports = { getUserMissionsStatus };
