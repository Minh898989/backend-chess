const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');

const app = express();

// Configure CORS to allow only your frontend origin
app.use(cors({
  origin: 'https://frontend-chess-nine.vercel.app',
  credentials: true, // if you're using cookies or authorization headers
}));

app.use(express.json());
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
