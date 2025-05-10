const db = require('../config/db');

exports.getStatsByUserId = async (userid) => {
  const { rows } = await db.query('SELECT * FROM user_stats WHERE userid = $1', [userid]);
  return rows[0];
};
