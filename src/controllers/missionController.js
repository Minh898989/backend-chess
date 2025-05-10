const MissionModel = require("../models/missionModel");

exports.getClaimedMissions = async (req, res) => {
  try {
    const { userId } = req.params;
    const today = new Date().toISOString().split("T")[0];
    const claimed = await MissionModel.getClaimedMissions(userId, today);
    res.json({ claimed });
  } catch (err) {
    console.error("Error getting claimed missions:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.claimMission = async (req, res) => {
  try {
    const { userId } = req.params;
    const { missionId } = req.body;
    const today = new Date().toISOString().split("T")[0];
    await MissionModel.claimMission(userId, missionId, today);
    res.json({ success: true, message: "Mission claimed" });
  } catch (err) {
    console.error("Error claiming mission:", err);
    res.status(500).json({ error: "Server error" });
  }
};
