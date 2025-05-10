const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes'); // đường dẫn đúng

const app = express();

// CORS cấu hình
const corsOptions = {
  origin: 'https://frontend-chess-seven.vercel.app/',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

// ✅ KHÔNG chứa dấu ':' không hợp lệ
app.use('/api/auth', authRoutes); // đúng

// Middleware lỗi
app.use((err, req, res, next) => {
  console.error('Error details:', err);
  res.status(500).json({ error: 'Server error', message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
