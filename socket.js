module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('🟢 Socket connected:', socket.id);

    socket.on('joinRoom', (roomCode) => {
      socket.join(roomCode);
      console.log(`User ${socket.id} joined room ${roomCode}`);
    });

    socket.on('move', ({ roomCode, move }) => {
      console.log(`♟️ Move in room ${roomCode}:`, move);
      socket.to(roomCode).emit('move', move); // Gửi đến người chơi còn lại
    });

    socket.on('resign', ({ roomCode, user }) => {
      socket.to(roomCode).emit('opponentResigned', user);
    });

    socket.on('disconnect', () => {
      console.log('🔴 Disconnected:', socket.id);
    });
  });
};
