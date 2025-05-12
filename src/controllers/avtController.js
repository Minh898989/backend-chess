const { uploadAvatarToCloudinary, updateUserAvatar ,getUserById } = require("../models/avtModel");

const uploadAvatar = async (req, res) => {
  try {
    const userid = req.params.userid;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const uploadResult = await uploadAvatarToCloudinary(req.file);
    const avatarUrl = uploadResult.secure_url;

    await updateUserAvatar(userid, avatarUrl);

    res.json({ message: "Avatar uploaded successfully", avatar: avatarUrl });
  } catch (error) {
    console.error("Lỗi khi tải lên avatar:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userid = req.params.userid;
    const user = await getUserById(userid);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Lỗi khi lấy thông tin người dùng:", err);
    res.status(500).json({ error: "Server error" });
  }
};


module.exports = {
  uploadAvatar,
  getUserProfile
};
