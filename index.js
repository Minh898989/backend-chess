const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes'); // Đảm bảo đường dẫn đúng

const app = express();

// CORS cấu hình
const corsOptions = {
  origin: 'https://frontend-chess-seven.vercel.app', // Không cần dấu '/' ở cuối
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Cho phép gửi cookie/tokens
};

// Sử dụng CORS middleware
app.use(cors(corsOptions));

app.use(express.json());

// Đăng ký routes
app.use('/api/auth', authRoutes); // Đảm bảo đúng đường dẫn

// Middleware xử lý lỗi
app.use((err, req, res, next) => {
  console.error('Error details:', err); // In ra chi tiết lỗi
  res.status(500).json({ error: 'Server error', message: err.message }); // Trả về thông báo lỗi cho client
});

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
