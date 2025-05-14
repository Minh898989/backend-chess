const Room = require('../models/roomModel');

module.exports = {
  async createRoom(req, res, next) {
    try {
      const { host_userid } = req.body;
      const room_code = Math.floor(1000 + Math.random() * 9000);

      const room = await Room.createRoom(host_userid, room_code);
      res.json({ success: true, room });
    } catch (err) {
      next(err);
    }
  },

  async joinRoom(req, res, next) {
    try {
      const { room_code, guest_userid } = req.body;
      const room = await Room.findRoomByCode(room_code);

      if (!room) return res.status(404).json({ error: 'Room not found' });
      if (room.status !== 'waiting') return res.status(400).json({ error: 'Room already started or full' });

      const updatedRoom = await Room.joinRoom(room_code, guest_userid);
      res.json({ success: true, room: updatedRoom });
    } catch (err) {
      next(err);
    }
  }
};
