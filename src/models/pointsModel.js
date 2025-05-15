const db = require('../config/db');

const updateStatsOnResign = async ({ winnerId, loserId, winnerCaptured, loserCaptured, minutesEach }) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    await client.query(`
      UPDATE user_stats
      SET 
        games_played = games_played + 1,
        games_won = games_won + 1,
        total_minutes = total_minutes + $2,
        total_captured = total_captured + $3,
        updated_at = NOW()
      WHERE userid = $1
    `, [winnerId, minutesEach, winnerCaptured]);

    await client.query(`
      UPDATE user_stats
      SET 
        games_played = games_played + 1,
        total_minutes = total_minutes + $2,
        total_captured = total_captured + $3,
        updated_at = NOW()
      WHERE userid = $1
    `, [loserId, minutesEach, loserCaptured]);

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

module.exports = { updateStatsOnResign };
