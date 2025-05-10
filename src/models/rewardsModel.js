const pool = require("../config/db");

const getUserReward = async (userId) => {
  const res = await pool.query(
    "SELECT points FROM user_rewards WHERE user_id = $1",
    [userId]
  );
  return res.rows[0];
};

const insertOrUpdateUserReward = async (userId, points) => {
  await pool.query(
    `
    INSERT INTO user_rewards (user_id, points)
    VALUES ($1, $2)
    ON CONFLICT (user_id)
    DO UPDATE SET points = user_rewards.points + $2, updated_at = CURRENT_TIMESTAMP
    `,
    [userId, points]
  );
};

const initializeUserReward = async (userId) => {
  await pool.query(
    "INSERT INTO user_rewards (user_id, points) VALUES ($1, 0) ON CONFLICT DO NOTHING",
    [userId]
  );
};

module.exports = {
  getUserReward,
  insertOrUpdateUserReward,
  initializeUserReward,
};
