const db = require('../config/db');

module.exports = {
  async createRoom(host_userid, room_code) {
    const result = await db.query(
      'INSERT INTO rooms (room_code, host_userid) VALUES ($1, $2) RETURNING *',
      [room_code, host_userid]
    );
    return result.rows[0];
  },

  async findRoomByCode(room_code) {
    const result = await db.query(
      'SELECT * FROM rooms WHERE room_code = $1',
      [room_code]
    );
    return result.rows[0];
  },

  async joinRoom(room_code, guest_userid) {
    const result = await db.query(
      `UPDATE rooms
       SET guest_userid = $1, status = 'playing'
       WHERE room_code = $2 AND status = 'waiting'
       RETURNING *`,
      [guest_userid, room_code]
    );
    return result.rows[0];
  }
};
