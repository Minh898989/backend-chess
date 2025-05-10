const db = require('../config/db');

exports.claimMission = async (userid, mission_id) => {
  await db.query(`
    INSERT INTO user_missions (userid, mission_id, claimed, claimed_at)
    VALUES ($1, $2, true, NOW())
  `, [userid, mission_id]);
};

exports.isMissionClaimed = async (userid, mission_id) => {
  const { rows } = await db.query(`
    SELECT * FROM user_missions WHERE userid = $1 AND mission_id = $2
  `, [userid, mission_id]);
  return rows.length > 0;
};
