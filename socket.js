const roomMembers = {}; // Lưu số người trong mỗi phòng

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('🟢 Socket connected:', socket.id);

    socket.on('joinRoom', (roomCode) => {
      roomCode = String(roomCode);
      socket.join(roomCode);
      console.log(`User ${socket.id} joined room ${roomCode}`);

      // Cập nhật số lượng socket trong phòng
      if (!roomMembers[roomCode]) {
        roomMembers[roomCode] = new Set();
      }
      roomMembers[roomCode].add(socket.id);

      const numMembers = roomMembers[roomCode].size;
      console.log(`Room ${roomCode} has ${numMembers} members.`);

      // Khi đủ 2 người thì emit startGame
      if (numMembers === 2) {
        io.to(roomCode).emit('startGame', { room_code: roomCode });
        console.log(`🚀 startGame emitted to room ${roomCode}`);
      }
    });

    socket.on('move', ({ roomCode, move }) => {
      socket.to(String(roomCode)).emit('move', move);
    });

    socket.on('resign', ({ roomCode, user }) => {
      socket.to(String(roomCode)).emit('opponentResigned', user);
    });

    socket.on('disconnect', () => {
      console.log('🔴 Disconnected:', socket.id);
      // Xoá socket khỏi tất cả các phòng đã lưu
      for (const roomCode in roomMembers) {
        roomMembers[roomCode].delete(socket.id);
        if (roomMembers[roomCode].size === 0) {
          delete roomMembers[roomCode]; // Dọn dẹp
        }
      }
    });
  });
};
