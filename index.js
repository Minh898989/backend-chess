const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
const path = require('path');

const authRoutes = require('./src/routes/authRoutes');
const gameRoutes = require('./src/routes/statsRoutes');
const missionRoutes = require('./src/routes/missionRoutes');
const userRoutes = require('./src/routes/avtRoutes');
const leaderboardRoutes = require('./src/routes/leaderboardRoutes');
const roomRoutes = require('./src/routes/roomRoutes');
const resignRoutes = require('./src/routes/pointsRoutes');
const friendRoutes = require('./src/routes/friendRoutes');

const setupSocket = require('./socket');
const app = express();

const corsOptions = {
  origin: 'https://frontend-chess-seven.vercel.app', 
  methods: ['GET', 'POST', 'PUT', 'DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  transports: ['websocket'],
};
app.use(cors(corsOptions));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://frontend-chess-seven.vercel.app',
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket'] // ⬅️ Rất quan trọng trên Render
});


app.set('io', io); // ✅ Đặt trước router
setupSocket(io);


// Đăng ký routes
app.use('/api/auth', authRoutes); 
app.use('/api/stats', gameRoutes);
app.use('/api', missionRoutes);
app.use("/api/users", userRoutes);
app.use('/api', leaderboardRoutes);
app.use('/api/rooms', roomRoutes); 
app.use('/api', resignRoutes);
app.use('/api/friends', friendRoutes);
// Middleware xử lý lỗi
app.use((err, req, res, next) => {
  console.error('Error details:', err);
  res.status(500).json({ error: 'Server error', message: err.message }); 
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
