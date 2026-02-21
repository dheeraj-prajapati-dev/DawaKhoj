const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getMe, 
  updateProfile,
  logoutUser,
  forgotPassword, // 🔥 New
  resetPassword  // 🔥 New
} = require('../controllers/auth.controller');

const { protect } = require('../middlewares/authMiddleware');
const { validate, registerSchema, loginSchema } = require('../middlewares/validators');

// ✅ Public Routes
router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.post('/logout', logoutUser);
router.post('/forgot-password', forgotPassword); // 🔥 New
router.put('/reset-password/:token', resetPassword); // 🔥 New

// 🔐 Private Routes
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);

module.exports = router;