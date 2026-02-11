const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 📝 REGISTER
exports.registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ success: false, message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name, email, phone, password: hashedPassword, role: role || 'patient'
    });

    res.status(201).json({ success: true, message: 'User registered successfully', userId: user._id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔑 LOGIN (With HTTP-Only Cookie)
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    const cookieOptions = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true, // Render par HTTPS hota hai, isliye true hi rahega
      sameSite: 'none', // Cross-origin login (localhost to render) ke liye mandatory hai
    };

    res.cookie('token', token, cookieOptions).json({
      success: true,
      user: { id: user._id, name: user.name, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🚪 LOGOUT
exports.logoutUser = (req, res) => {
  // Same settings use karein jo login mein ki thi, taaki browser cookie delete kar sake
  res.cookie('token', '', { 
    expires: new Date(0), 
    httpOnly: true,
    secure: true,
    sameSite: 'none'
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};


// 👤 GET ME
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔄 UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { name, phone, address } },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};