const {
  getUserReward,
  insertOrUpdateUserReward,
  initializeUserReward,
} = require("../models/rewardsModel");

exports.getRewardPoints = async (req, res) => {
  const { userId } = req.params;
  try {
    await initializeUserReward(userId);
    const reward = await getUserReward(userId);
    res.json({ points: reward?.points || 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi lấy điểm thưởng" });
  }
};

exports.addRewardPoints = async (req, res) => {
  const { userId } = req.params;
  const { points } = req.body;

  if (!points || typeof points !== "number") {
    return res.status(400).json({ error: "Số điểm không hợp lệ" });
  }

  try {
    await insertOrUpdateUserReward(userId, points);
    res.json({ message: "Điểm đã được cộng thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi khi cộng điểm thưởng" });
  }
};
