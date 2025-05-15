const roomMembers = {};     // roomCode -> Set of socket.id
const playerMapping = {};   // socket.id -> { roomCode, color }

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('🟢 Socket connected:', socket.id);

    socket.on('joinRoom', (roomCode) => {
      roomCode = String(roomCode);
      if (!roomMembers[roomCode]) {
        roomMembers[roomCode] = new Set();
      }

      const numMembers = roomMembers[roomCode].size;

      if (numMembers >= 2) {
        // Phòng đầy, không cho vào
        socket.emit('roomFull');
        console.log(`🚫 Room ${roomCode} full. User ${socket.id} denied.`);
        return;
      }

      socket.join(roomCode);
      roomMembers[roomCode].add(socket.id);
      console.log(`✅ User ${socket.id} joined room ${roomCode}`);
      console.log(`Room ${roomCode} now has ${roomMembers[roomCode].size} members.`);

      // Khi đủ 2 người thì gán màu và emit startGame
      if (roomMembers[roomCode].size === 2) {
        const players = Array.from(roomMembers[roomCode]);
        const [playerWhite, playerBlack] = players;

        playerMapping[playerWhite] = { roomCode, color: 'white' };
        playerMapping[playerBlack] = { roomCode, color: 'black' };

        io.to(playerWhite).emit('startGame', { color: 'white', room_code: roomCode });
        io.to(playerBlack).emit('startGame', { color: 'black', room_code: roomCode });


        console.log(`🚀 Game started in room ${roomCode}`);
        console.log(`👤 Assigning WHITE to ${playerWhite}`);
        console.log(`👤 Assigning BLACK to ${playerBlack}`);
      }
    });

    socket.on('move', ({ roomCode, move, fen }) => {
      console.log(`📤 MOVE in room ${roomCode}:`, move);
      socket.to(String(roomCode)).emit('move', { move, fen });
    });

   socket.on('resign', ({ roomCode, user }) => {
  socket.to(String(roomCode)).emit('opponentResigned', user);
});

    socket.on('disconnect', () => {
      console.log('🔴 Disconnected:', socket.id);

      // Xoá khỏi roomMembers và playerMapping
      for (const roomCode in roomMembers) {
        roomMembers[roomCode].delete(socket.id);

        if (roomMembers[roomCode].size === 0) {
          delete roomMembers[roomCode];
          console.log(`🧹 Cleaned up empty room ${roomCode}`);
        }
      }

      if (playerMapping[socket.id]) {
        delete playerMapping[socket.id];
      }
    });
  });
};
