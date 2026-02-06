// ====== IMPORTS ======
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http'); 
const { Server } = require('socket.io'); 
const connectDB = require('./config/db');

// ====== ENV & DB ======
dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app); 

// ====== ALLOWED ORIGINS ======
// Naya domain dawakhoj.in yahan add kiya hai
const allowedOrigins = [
  "https://dawakhoj.in", 
  "https://www.dawakhoj.in", 
  "https://dawa-khoj.vercel.app", 
  "http://localhost:5173"
];

// ====== SOCKET SETUP ======
const io = new Server(server, {
  cors: {
    origin: allowedOrigins, 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('⚡ Connected:', socket.id);
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`✅ User/Pharmacy Joined Room: ${roomId}`);
  });
  socket.on('disconnect', () => console.log('❌ Disconnected'));
});

app.set('socketio', io);

// ====== MIDDLEWARES ======
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Optimized CORS for API
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS block: Domain not allowed by DawaKhoj'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ====== ROUTES ======
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/pharmacy', require('./routes/pharmacy.routes'));
app.use('/api/inventory', require('./routes/inventory.routes'));
app.use('/api/search', require('./routes/search.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/geo-search', require('./routes/geoSearch.routes'));
app.use('/api/prescription', require('./routes/prescription.routes'));
app.use('/api/flow', require('./routes/flow.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

// ====== ADMIN TEST ======
const { protect, authorizeRoles } = require('./middlewares/authMiddleware');
app.get('/api/admin-test', protect, authorizeRoles('admin'), (req, res) => {
  res.json({ message: 'Welcome Admin 👑', user: req.user });
});

app.get('/', (req, res) => res.send('Welcome to DawaKhoj API (Production Mode) 🚀'));

// ====== SERVER START ======
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => { 
  console.log(`✅ Server running on port ${PORT}`);
});