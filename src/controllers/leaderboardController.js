// controllers/leaderboardController.js
const userModel = require('../models/leaderboardModel');

const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await userModel.getLeaderboard();
    res.status(200).json({ success: true, data: leaderboard });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getLeaderboard
};
