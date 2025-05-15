const { updateStatsOnResign } = require('../models/pointsModel');

const resign = async (req, res) => {
  try {
    const { winnerId, loserId, winnerCaptured, loserCaptured, startTime } = req.body;

    if (!winnerId || !loserId || !startTime) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const now = new Date();
    const start = new Date(startTime);
    const totalMinutes = Math.ceil((now - start) / 60000); // làm tròn phút
    const minutesEach = Math.floor(totalMinutes / 2); // chia đôi cho mỗi người

    await updateStatsOnResign({
      winnerId,
      loserId,
      winnerCaptured: winnerCaptured || 0,
      loserCaptured: loserCaptured || 0,
      minutesEach
    });

    res.json({ message: 'Stats updated successfully' });
  } catch (err) {
    console.error('Error in resignController:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { resign };
