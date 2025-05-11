const MissionModel = require('../models/missionModel');

// GET /missions/user/:userid
async function getUserMissionsStatus(req, res) {
  try {
    const { userid } = req.params;

    // Lấy tất cả nhiệm vụ, thông tin stats của người chơi, nhiệm vụ đã nhận hôm nay, và tổng điểm
    const [missions, stats, claimedToday, totalPoints] = await Promise.all([
      MissionModel.getAllMissions(),
      MissionModel.getUserStats(userid),
      MissionModel.getUserClaimedMissionIdsToday(userid),
      MissionModel.getUserTotalPoints(userid),
    ]);

    if (!stats) return res.status(404).json({ error: 'User stats not found.' });

    // Enrich missions with completion status
    const enrichedMissions = missions.map((mission) => {
      let isCompleted = false;

      // Kiểm tra điều kiện hoàn thành mỗi nhiệm vụ
      switch (mission.id) {
        case 1:
          isCompleted = true; // Nhiệm vụ đăng nhập hằng ngày
          break;
        case 2:
          isCompleted = stats.games_played >= 5; // Chơi ít nhất 5 trận
          break;
        case 3:
          isCompleted = stats.games_won >= 3; // Thắng ít nhất 3 trận
          break;
        case 4:
          isCompleted = stats.total_minutes >= 10; // Chơi ít nhất 10 phút
          break;
        case 5:
          isCompleted = stats.total_captured >= 10; // Bắt ít nhất 10 quân
          break;
        default:
          isCompleted = false;
      }

      // Trả về thông tin của nhiệm vụ, bao gồm trạng thái hoàn thành và đã nhận thưởng hôm nay
      return {
        ...mission,
        isCompleted,
        isClaimedToday: claimedToday.includes(mission.id),
      };
    });

    // Trả về danh sách nhiệm vụ và tổng điểm
    res.json({ missions: enrichedMissions, totalPoints });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

// Claim reward for a mission
async function claimMissionReward(req, res) {
  try {
    const { userid, missionId } = req.body;

    // Kiểm tra xem người chơi có đủ điều kiện để nhận thưởng không
    const [mission, stats, claimedToday] = await Promise.all([
      MissionModel.getMissionById(missionId),
      MissionModel.getUserStats(userid),
      MissionModel.getUserClaimedMissionIdsToday(userid),
    ]);

    if (!mission) return res.status(404).json({ error: 'Mission not found.' });
    if (claimedToday.includes(missionId)) return res.status(400).json({ error: 'Mission already claimed today.' });

    // Kiểm tra điều kiện hoàn thành nhiệm vụ
    let isCompleted = false;
    switch (mission.id) {
      case 1:
        isCompleted = true;
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

    if (!isCompleted) {
      return res.status(400).json({ error: 'Mission not completed yet.' });
    }

    // Cập nhật dữ liệu vào bảng user_missions và cộng điểm cho người chơi
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
