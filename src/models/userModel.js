const db = require('../config/db');

const findUserByUserId = (userid, callback) => {
  db.query('SELECT * FROM users WHERE userid = $1', [userid], (err, result) => {
    if (err) return callback(err);
    callback(null, result.rows);
  });
};

const createUser = (userid, password, callback) => {
  db.query('INSERT INTO users (userid, password) VALUES ($1, $2)', [userid, password], callback);
};

module.exports = { findUserByUserId, createUser };
