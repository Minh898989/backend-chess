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

      // ✅ Gửi cập nhật tới phòng socket
      const io = req.app.get('io'); // io phải được gán ở server.js
      io.to(String(room_code)).emit('roomUpdated', updatedRoom);
      
      if (updatedRoom.host_userid && updatedRoom.guest_userid) {
      io.to(String(room_code)).emit('startGame', updatedRoom);
      console.log('🎮 Game started in room', room_code);
    }

      res.json({ success: true, room: updatedRoom });
    } catch (err) {
      next(err);
    }
  },
  async getRoomByCode(req, res, next) {
  try {
    const room_code = parseInt(req.params.room_code);
    const room = await Room.getRoomByCode(room_code);

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.json({ success: true, room });
  } catch (err) {
    next(err);
  }
}

};
