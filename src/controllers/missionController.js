const MissionModel = require("../models/missionModel");

const MissionController = {
  async getClaimedMissions(req, res) {
  const { userId } = req.params;
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  try {
    const claimed = await MissionModel.getClaimedMissions(userId, today);
    res.json({ claimed }); // Trả đúng tên key như frontend mong đợi
  } catch (err) {
    console.error("Error getting claimed missions:", err);
    res.status(500).json({ error: "Server error" });
  }
},

  async claimMission(req, res) {
    const { userId, missionId } = req.body;
    try {
      await MissionModel.claimMission(userId, missionId);
      res.json({ message: "Mission claimed successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  },
};

module.exports = MissionController;
