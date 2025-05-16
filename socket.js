const roomMembers = {};     // roomCode -> Set of socket.id
const playerMapping = {};   // socket.id -> { roomCode, color }
const userMapping = {};     // socket.id -> userid

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`🟢 Socket connected: ${socket.id}`);

    socket.on('joinRoom', (roomCode, userid) => {
      userMapping[socket.id] = userid;
      roomCode = String(roomCode);

      if (!roomMembers[roomCode]) {
        roomMembers[roomCode] = new Set();
      }

      const numMembers = roomMembers[roomCode].size;

      if (numMembers >= 2) {
        socket.emit('roomFull');
        console.log(`🚫 Room ${roomCode} full. User ${socket.id} denied.`);
        return;
      }

      socket.join(roomCode);
      roomMembers[roomCode].add(socket.id);
      console.log(`✅ User ${socket.id} joined room ${roomCode}`);
      console.log(`📊 Room ${roomCode} now has ${roomMembers[roomCode].size} members.`);

      if (roomMembers[roomCode].size === 2) {
        const players = Array.from(roomMembers[roomCode]);
        const [playerWhite, playerBlack] = players;

        const whiteUserId = userMapping[playerWhite];
        const blackUserId = userMapping[playerBlack];

        playerMapping[playerWhite] = { roomCode, color: 'white' };
        playerMapping[playerBlack] = { roomCode, color: 'black' };

        io.to(playerWhite).emit('startGame', {
          color: 'white',
          room_code: roomCode,
          yourUserId: whiteUserId,
          opponentUserId: blackUserId,
        });

        io.to(playerBlack).emit('startGame', {
          color: 'black',
          room_code: roomCode,
          yourUserId: blackUserId,
          opponentUserId: whiteUserId,
        });

        console.log(`🚀 Game started in room ${roomCode}`);
        console.log(`👤 Assigning WHITE to ${playerWhite} (${whiteUserId})`);
        console.log(`👤 Assigning BLACK to ${playerBlack} (${blackUserId})`);
      }
    });

    socket.on('move', ({ roomCode, move, fen }) => {
      console.log(`📤 MOVE in room ${roomCode}:`, move);
      socket.to(String(roomCode)).emit('move', { move, fen });
    });

    socket.on('resign', ({ winner, loser }) => {
      const mapping = playerMapping[socket.id];
      if (!mapping || !mapping.roomCode) return;

      const roomCode = mapping.roomCode;
      console.log(`🏳️ Player ${loser} resigned in room ${roomCode}. Winner: ${winner}`);
      socket.to(roomCode).emit('opponentResigned', { winner, loser });
    });

    socket.on('disconnect', () => {
      console.log(`🔴 Disconnected: ${socket.id}`);

      for (const roomCode in roomMembers) {
        roomMembers[roomCode].delete(socket.id);
        if (roomMembers[roomCode].size === 0) {
          delete roomMembers[roomCode];
          console.log(`🧹 Cleaned up empty room ${roomCode}`);
        }
      }

      delete playerMapping[socket.id];
      delete userMapping[socket.id];
    });
  });
};
