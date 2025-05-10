const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes'); // Đảm bảo đường dẫn chính xác

const app = express();

// Cấu hình CORS để chỉ cho phép frontend từ origin cụ thể
const corsOptions = {
  origin: 'https://frontend-chess-nine.vercel.app', // Địa chỉ frontend của bạn
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Các phương thức HTTP được phép
  allowedHeaders: ['Content-Type', 'Authorization'], // Các headers được phép
  credentials: true, // Cho phép gửi cookie hoặc thông tin xác thực
};

// Sử dụng middleware CORS cho toàn bộ ứng dụng
app.use(cors(corsOptions));

// Xử lý các yêu cầu preflight (OPTIONS)
app.options('*', cors(corsOptions));

// Cấu hình body parser để xử lý JSON trong request
app.use(express.json());

// Đăng ký các route của API
app.use('/api/auth', authRoutes);

// Middleware xử lý lỗi
app.use((err, req, res, next) => {
  console.error('Error details:', err);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message || 'Internal Server Error',
    details: err.stack,
  });
});

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
