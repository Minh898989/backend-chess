const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');

const app = express();

const corsOptions = {
  origin: 'https://frontend-chess-nine.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
  console.error('Error details:', err);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message || 'Internal Server Error',
    details: err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
