const db = require('../config/db');

const findUserByUserId = (userid, callback) => {
  db.query('SELECT * FROM users WHERE userid = ?', [userid], callback);
};

const createUser = (userid, password, callback) => {
  db.query('INSERT INTO users (userid, password) VALUES (?, ?)', [userid, password], callback);
};

module.exports = { findUserByUserId, createUser };
