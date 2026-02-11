const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http'); 
const { Server } = require('socket.io'); 
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Environment variables aur Database connection
dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app); 

// 🛡️ Render/Heroku jaise proxies ke peeche Secure Cookies ke liye zaruri hai
app.set('trust proxy', 1);

// ====== 1. CONFIG (Allowed Origins) ======
const allowedOrigins = [
  "https://dawakhoj.in", 
  "https://www.dawakhoj.in", 
  "https://dawa-khoj.vercel.app", 
  "http://localhost:5173" // Local testing ke liye
];

// ====== 2. MIDDLEWARES ======

// CORS configuration - Cookies ke liye sabse upar hona chahiye
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS block by DawaKhoj Security'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ====== 3. SOCKET SETUP ======
const io = new Server(server, {
  cors: { 
    origin: allowedOrigins, 
    credentials: true,
    methods: ["GET", "POST"]
  },
  transports: ['websocket', 'polling'] // Stability ke liye production mein dono rakhen
});

io.on('connection', (socket) => {
  console.log('⚡ Socket Connected:', socket.id);
  socket.on('join_room', (roomId) => socket.join(roomId));
  socket.on('disconnect', () => console.log('❌ Socket Disconnected'));
});

// Socket instance ko app mein set karein taaki controllers mein use ho sake
app.set('socketio', io);

// ====== 4. ROUTES ======
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/pharmacy', require('./routes/pharmacy.routes'));
app.use('/api/inventory', require('./routes/inventory.routes'));
app.use('/api/search', require('./routes/search.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/prescription', require('./routes/prescription.routes'));
app.use('/api/flow', require('./routes/flow.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

// Admin Test Route
const { protect, authorizeRoles } = require('./middlewares/authMiddleware');
app.get('/api/admin-test', protect, authorizeRoles('admin'), (req, res) => {
  res.json({ message: 'Welcome Admin 👑', user: req.user });
});

// Health Check
app.get('/', (req, res) => res.send('DawaKhoj API is Running... 🚀'));

// ====== 5. START SERVER ======
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));