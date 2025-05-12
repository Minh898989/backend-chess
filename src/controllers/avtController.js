const path = require("path");
const { updateUserAvatar, getUserById } = require("../models/avtModel");

const uploadAvatar = async (req, res) => {
  try {
    const userId = req.params.userid;

    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const avatarPath = `/uploads/${req.file.filename}`;

    await updateUserAvatar(userId, avatarPath);

    res.json({ message: "Avatar uploaded", avatar: avatarPath });
  } catch (error) {
    console.error("Upload avatar error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await getUserById(req.params.userid);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  uploadAvatar,
  getUserProfile,
};
