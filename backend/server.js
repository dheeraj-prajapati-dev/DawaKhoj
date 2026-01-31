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

// ====== SOCKET SETUP ======
const io = new Server(server, {
  cors: {
    // Frontend URLs ko yahan bhi update kiya taaki socket connect ho sake
    origin: ["https://dawa-khoj.vercel.app", "http://localhost:5173"], 
    methods: ["GET", "POST", "PUT"],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('⚡ Connected:', socket.id);
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`✅ User/Pharmacy Joined Room: ${roomId} `);
  });
  socket.on('disconnect', () => console.log('❌ Disconnected'));
});

app.set('socketio', io);

// ====== MIDDLEWARES ======
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// FIX: cors(cors(...)) ko hata kar simple app.use(cors(...)) kiya
app.use(cors({
  origin: ["https://dawa-khoj.vercel.app", "http://localhost:5173"],
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

app.get('/', (req, res) => res.send('Welcome to DawaKhoj API'));

// ====== SERVER START ======
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => { 
  console.log(`✅ Server running on port ${PORT}`);
});