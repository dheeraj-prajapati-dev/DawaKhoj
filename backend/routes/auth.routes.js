const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getMe, 
  updateProfile,
  logoutUser // 🔥 Logout bhi add kar diya hai
} = require('../controllers/auth.controller');

const { protect } = require('../middlewares/authMiddleware');
const { validate, registerSchema, loginSchema } = require('../middlewares/validators');

// ✅ Public Routes
// Register se pehle Zod validation chalega
router.post('/register', validate(registerSchema), registerUser);

// Login se pehle Zod validation chalega
router.post('/login', validate(loginSchema), loginUser);

// Logout (Cookie clear karne ke liye)
router.post('/logout', logoutUser);

// 🔐 Private Routes (Login Zaroori Hai)
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);

module.exports = router;