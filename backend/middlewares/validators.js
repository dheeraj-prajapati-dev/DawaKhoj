const { z } = require('zod');

// 📝 Registration Schema
const registerSchema = z.object({
  name: z.string().min(3, "Naam kam se kam 3 characters ka hona chahiye"),
  email: z.string().email("Sahi email address dalein"),
  phone: z.string().length(10, "Mobile number poore 10 digit ka hona chahiye"),
  password: z.string().min(6, "Password kam se kam 6 characters ka ho"),
  role: z.enum(['patient', 'pharmacy', 'admin']).optional()
});

// 🔑 Login Schema
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password zaruri hai")
});

// Middleware function to validate
const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body); // Ye check karega ki data sahi hai ya nahi
    next();
  } catch (error) {
    // Agar error hai toh sirf pehla error message bhejo
    return res.status(400).json({ 
      success: false, 
      message: error.errors[0].message 
    });
  }
};

module.exports = { registerSchema, loginSchema, validate };