const pool = require("../config/db");

const updateUserAvatar = async (userId, avatarPath) => {
  const query = "UPDATE users SET avatar = $1 WHERE id = $2";
  const values = [avatarPath, userId];
  await pool.query(query, values);
};

const getUserById = async (userId) => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
  return result.rows[0];
};

module.exports = {
  updateUserAvatar,
  getUserById,
};
