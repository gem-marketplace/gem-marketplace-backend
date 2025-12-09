const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Password reset routes (Public)
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes (require authentication)
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;