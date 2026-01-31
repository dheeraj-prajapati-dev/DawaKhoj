const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/auth.controller');
const User = require('../models/User');
const { protect } = require('../middlewares/authMiddleware');

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private Routes (Login Zaroori Hai)
// 1. Frontend useEffect ke liye User data lane wala route
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. Profile update karne wala route
router.put('/update-profile', protect, async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { name, phone, address } },
      { new: true }
    ).select('-password');
    
    res.json({ success: true, user: updatedUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;