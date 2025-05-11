const db = require('../config/db');

const getStatsByUser = async (userid) => {
  const res = await db.query('SELECT * FROM user_stats WHERE userid = $1', [userid]);
  return res.rows[0];
};

const createOrUpdateStats = async (userid, didWin, minutesPlayed, capturedCount) => {
  const existing = await getStatsByUser(userid);

  if (existing) {
    const updated = await db.query(
      `UPDATE user_stats SET
        games_played = games_played + 1,
        games_won = games_won + $1,
        total_minutes = total_minutes + $2,
        total_captured = total_captured + $3,
        updated_at = NOW()
       WHERE userid = $4 RETURNING *`,
      [didWin ? 1 : 0, minutesPlayed, capturedCount, userid]
    );
    return updated.rows[0];
  } else {
    const inserted = await db.query(
      `INSERT INTO user_stats (userid, games_played, games_won, total_minutes, total_captured)
       VALUES ($1, 1, $2, $3, $4) RETURNING *`,
      [userid, didWin ? 1 : 0, minutesPlayed, capturedCount]
    );
    return inserted.rows[0];
  }
};

module.exports = {
  getStatsByUser,
  createOrUpdateStats,
};