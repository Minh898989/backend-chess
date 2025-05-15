const roomMembers = {};     // roomCode -> Set of socket.id
const playerMapping = {};   // socket.id -> { roomCode, color }

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`🟢 Socket connected: ${socket.id}`);

    // Handle player joining a room
    socket.on('joinRoom', (roomCode) => {
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

      // If room has 2 players, assign colors and start the game
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

    // Handle move event from a player
    socket.on('move', ({ roomCode, move, fen }) => {
      console.log(`📤 MOVE in room ${roomCode}:`, move);
      socket.to(String(roomCode)).emit('move', { move, fen });
    });

    // Handle resignation
    socket.on('resign', ({ winner, loser }) => {
      const mapping = playerMapping[socket.id];
      if (!mapping || !mapping.roomCode) return;

      const roomCode = mapping.roomCode;
      console.log(`🏳️ Player ${loser} resigned in room ${roomCode}. Winner: ${winner}`);
      socket.to(roomCode).emit('opponentResigned', { winner, loser });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`🔴 Disconnected: ${socket.id}`);

      // Remove player from all rooms they were in
      for (const roomCode in roomMembers) {
        roomMembers[roomCode].delete(socket.id);

        if (roomMembers[roomCode].size === 0) {
          delete roomMembers[roomCode];
          console.log(`🧹 Cleaned up empty room ${roomCode}`);
        }
      }

      // Remove from player mapping
      if (playerMapping[socket.id]) {
        delete playerMapping[socket.id];
      }
    });
  });
};
