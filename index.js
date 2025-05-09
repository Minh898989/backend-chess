const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes'); // Đảm bảo đường dẫn chính xác

const app = express();

// Cấu hình CORS để chỉ cho phép frontend từ origin cụ thể
const corsOptions = {
  origin: 'https://frontend-chess-nine.vercel.app', // Địa chỉ frontend của bạn
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Các phương thức HTTP được phép
  allowedHeaders: ['Content-Type', 'Authorization'], // Các headers được phép
  credentials: true, // Nếu bạn sử dụng cookies hoặc headers xác thực
};

// Sử dụng middleware CORS cho toàn bộ ứng dụng
app.use(cors(corsOptions));

// Cấu hình body parser để xử lý JSON trong request
app.use(express.json());

// Đăng ký các route của API
app.use('/api/auth', authRoutes);  // Đảm bảo có đúng các đường dẫn

// Middleware xử lý lỗi
app.use((err, req, res, next) => {
  console.error('Error details:', err);  // In lỗi chi tiết ra console
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message || 'Internal Server Error',
    details: err.stack,  // Trả về stack trace chi tiết cho debug
  });
});

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
