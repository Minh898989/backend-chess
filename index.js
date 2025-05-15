const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const authRoutes = require('./src/routes/authRoutes');
const gameRoutes = require('./src/routes/statsRoutes');
const missionRoutes = require('./src/routes/missionRoutes');
const userRoutes = require('./src/routes/avtRoutes');
const leaderboardRoutes = require('./src/routes/leaderboardRoutes');
const roomRoutes = require('./src/routes/roomRoutes');
const http = require('http');

const path = require('path');
const app = express();
const setupSocket = require('./socket');

// CORS cấu hình
const corsOptions = {
  origin: 'https://frontend-chess-seven.vercel.app', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
});
// Sử dụng CORS middleware
app.use(cors(corsOptions));

app.use(express.json());

// Đăng ký routes
app.use('/api/auth', authRoutes); 
app.use('/api/stats', gameRoutes);
app.use('/api', missionRoutes);
app.use("/api/users", userRoutes);
app.use('/api', leaderboardRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/rooms', roomRoutes);


// Middleware xử lý lỗi
app.use((err, req, res, next) => {
  console.error('Error details:', err);
  res.status(500).json({ error: 'Server error', message: err.message }); 
});
app.set('io', io);
setupSocket(io);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
