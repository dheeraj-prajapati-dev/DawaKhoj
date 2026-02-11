const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { z } = require('zod');

// 🔐 TOKEN VERIFY (Cookie + Header Support)
exports.protect = async (req, res, next) => {
  try {
    let token = req.cookies.token; // Pehle cookie check karo

    if (!token && req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]; // Backup: Header check
    }

    if (!token) return res.status(401).json({ message: 'Not authorized, please login' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    res.status(401).json({ message: 'Session expired, login again' });
  }
};

// 🛡️ ROLE CHECK
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Access denied for role: ${req.user.role}` });
    }
    next();
  };
};

// ✅ ZOD VALIDATION SCHEMAS
const registerSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email format"),
  phone: z.string().length(10, "Phone must be 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(['patient', 'pharmacy', 'admin']).optional()
});

exports.validateRegister = (req, res, next) => {
  try {
    registerSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ success: false, message: error.errors[0].message });
  }
};