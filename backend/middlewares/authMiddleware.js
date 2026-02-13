const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { z } = require('zod');

// 🔐 TOKEN VERIFY (Optimized for Home Page)
exports.protect = async (req, res, next) => {
  try {
    let token = req.cookies ? req.cookies.token : null; 

    if (!token && req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 🔥 Fix: Home page par silent error bhejein, terminal mein log na karein
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No active session' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id).select('-password');

    if (!currentUser) {
      return res.status(401).json({ success: false, message: 'Account not found' });
    }

    req.user = currentUser;
    next();

  } catch (error) {
    // Sirf expire hone par hi console karein debug ke liye
    if (error.name === 'TokenExpiredError') {
      console.log("⏰ User session expired");
    }
    res.status(401).json({ success: false, message: 'Session expired' });
  }
};

// 🛡️ ROLE CHECK
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      });
    }
    next();
  };
};

// ✅ ZOD VALIDATION (Registration)
const registerSchema = z.object({
  name: z.string().trim().min(2, "Naam thoda bada likhein"),
  email: z.string().email("Email format sahi nahi hai").toLowerCase(),
  phone: z.string().regex(/^[0-9]{10}$/, "Mobile number 10 digits ka hona chahiye"),
  password: z.string().min(6, "Password kam se kam 6 characters ka ho"),
  role: z.enum(['patient', 'pharmacy', 'admin']).default('patient')
});

exports.validateRegister = (req, res, next) => {
  try {
    registerSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ success: false, message: error.errors[0].message });
  }
};