const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import models
const User = require('./models/User');
const Gem = require('./models/Gem');
const Auction = require('./models/Auction');
const Bid = require('./models/Bid');

// Import routes
const authRoutes = require('./routes/authRoutes');
const gemRoutes = require('./routes/gemRoutes');

// Test route
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'Welcome to Gem Marketplace API',
    version: '1.0.0'
  });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/gems', gemRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log('✅ Models loaded: User, Gem, Auction, Bid');
    
    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 API endpoints:`);
      console.log(`   - POST http://localhost:${PORT}/api/auth/register`);
      console.log(`   - POST http://localhost:${PORT}/api/auth/login`);
      console.log(`   - POST http://localhost:${PORT}/api/gems (create gem)`);
      console.log(`   - GET  http://localhost:${PORT}/api/gems (all gems)`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });