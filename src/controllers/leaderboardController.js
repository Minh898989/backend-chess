// controllers/leaderboardController.js
const userModel = require('../models/leaderboardModel');

const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await userModel.getLeaderboard();
    res.status(200).json({ success: true, data: leaderboard });
  } catch (err) {
    console.error("Lỗi khi lấy leaderboard:", err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getLeaderboard
};
