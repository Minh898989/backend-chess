const db = require('../config/db');

exports.getAllMissions = async () => {
  const { rows } = await db.query('SELECT * FROM missions ORDER BY id ASC');
  return rows;
};
