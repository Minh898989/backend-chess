const { uploadAvatarToCloudinary, updateUserAvatar } = require("../models/avtModel");

const uploadAvatar = async (req, res) => {
  try {
    const userId = req.params.userid;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload avatar lên Cloudinary
    const uploadResult = await uploadAvatarToCloudinary(req.file);

    // Lấy URL avatar từ kết quả upload và lưu vào CSDL
    const avatarUrl = uploadResult.secure_url;
    await updateUserAvatar(userId, avatarUrl);

    res.json({ message: "Avatar uploaded successfully", avatar: avatarUrl });
  } catch (error) {
    console.error("Lỗi khi tải lên avatar:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await getUserById(req.params.userid);
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
