const StatsModel = require('../models/statsModel');

exports.updateStats = async (req, res) => {
  const { userid, didWin, minutesPlayed, capturedCount } = req.body;
  if (!userid) return res.status(400).json({ message: "Thiếu userid" });

  try {
    const stats = await StatsModel.createOrUpdateStats(userid, didWin, minutesPlayed, capturedCount);
    res.json({ message: "Cập nhật thành công", stats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.getStats = async (req, res) => {
  const { userid } = req.params;
  try {
    const stats = await StatsModel.getStatsByUser(userid);
    if (!stats) return res.status(404).json({ message: "Không tìm thấy thống kê" });
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
