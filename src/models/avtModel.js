const cloudinary = require("cloudinary").v2;
const pool = require("../config/db");

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: "db3n1kswt", // Thay thế bằng cloud_name của bạn
  api_key: "299293383991286", // Thay thế bằng api_key của bạn
  api_secret: "WaYbfiv0cz909aajjehkItnagvA", // Thay thế bằng api_secret của bạn
});

// Cập nhật avatar vào cơ sở dữ liệu
const updateUserAvatar = async (userId, avatarUrl) => {
  const query = "UPDATE users SET avatar = $1 WHERE id = $2";
  const values = [avatarUrl, userId];
  await pool.query(query, values);
};

// Trả về thông tin người dùng
const getUserById = async (userId) => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
  return result.rows[0];
};

// Upload avatar lên Cloudinary
const uploadAvatarToCloudinary = async (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      (error, result) => {
        if (error) reject(error);
        resolve(result);
      }
    ).end(file.buffer);
  });
};

module.exports = {
  updateUserAvatar,
  getUserById,
  uploadAvatarToCloudinary
};
