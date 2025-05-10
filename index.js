const express = require('express');
const authRoutes = require('./src/routes/authRoutes'); // Đảm bảo đường dẫn chính xác

const app = express();

// Middleware xử lý CORS thủ công
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://frontend-chess-seven.vercel.app/'); // Chỉ cho phép origin từ frontend của bạn
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Các phương thức HTTP được phép
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Các headers được phép
  res.header('Access-Control-Allow-Credentials', 'true'); // Cho phép gửi thông tin xác thực (cookies, headers...)

  // Nếu là yêu cầu preflight (OPTIONS), trả về status 204 mà không cần tiếp tục
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  // Tiếp tục với các middleware hoặc routes khác
  next();
});

// Cấu hình body parser để xử lý JSON trong request
app.use(express.json());

// Đăng ký các route của API
app.use('/api/auth', authRoutes);

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
