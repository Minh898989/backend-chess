module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('🟢 Socket connected:', socket.id);

    socket.on('joinRoom', (roomCode) => {
      socket.join(String(roomCode));
      console.log(`User ${socket.id} joined room ${roomCode}`);
    });

    socket.on('move', ({ roomCode, move }) => {
      console.log(`♟️ Move in room ${roomCode}:`, move);
      socket.to(String(roomCode)).emit('move', move);
    });

    socket.on('resign', ({ roomCode, user }) => {
      socket.to(String(roomCode)).emit('opponentResigned', user);
    });

    socket.on('disconnect', () => {
      console.log('🔴 Disconnected:', socket.id);
    });
  });
};
