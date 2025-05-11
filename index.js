const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const gameRoutes = require('./src/routes/statsRoutes');
const missionRoutes = require('./src/routes/missionRoutes');

const app = express();

// CORS cấu hình
const corsOptions = {
  origin: 'https://frontend-chess-seven.vercel.app', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Sử dụng CORS middleware
app.use(cors(corsOptions));

app.use(express.json());

// Đăng ký routes
app.use('/api/auth', authRoutes); 
app.use('/api/stats', gameRoutes);
app.use('/api', missionRoutes);


// Middleware xử lý lỗi
app.use((err, req, res, next) => {
  console.error('Error details:', err);
  res.status(500).json({ error: 'Server error', message: err.message }); 
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
