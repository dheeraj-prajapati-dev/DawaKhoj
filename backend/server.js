// ====== BASIC LOG ======
console.log("👉 server.js file loaded");

// ====== IMPORTS ======
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// ====== DB CONNECT ======
const connectDB = require('./config/db');

// ====== ROUTES ======
const authRoutes = require('./routes/auth.routes');

// ====== ENV CONFIG ======
dotenv.config();

// ====== DB CONNECTION ======
console.log("👉 ENV loaded, connecting DB...");
connectDB();

// ====== APP INIT ======
const app = express();

// ====== MIDDLEWARES ======
app.use(express.json());
app.use(cors());

// ====== HEALTH CHECK ROUTE ======
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'DawaKhoj Backend is running 🚀'
  });
});

// ====== AUTH ROUTES ======
app.use('/api/auth', authRoutes);

const pharmacyRoutes = require('./routes/pharmacy.routes');

app.use('/api/pharmacy', pharmacyRoutes);


const inventoryRoutes = require('./routes/inventory.routes');

app.use('/api/inventory', inventoryRoutes);

// ===== SEARCH ROUTE ======
const searchRoutes = require('./routes/search.routes');

app.use('/api/search', searchRoutes);


// ====== DEFAULT ROUTE ======
app.get('/', (req, res) => {
  res.send('Welcome to DawaKhoj API');
});

// ====== SERVER START ======
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

const { protect, authorizeRoles } = require('./middleware/auth.middleware');

app.get('/api/admin-test', protect, authorizeRoles('admin'), (req, res) => {
  res.json({
    message: 'Welcome Admin 👑',
    user: req.user
  });
});


// ==== GEO-SEARCH =====
const geoSearchRoutes = require('./routes/geoSearch.routes');

app.use('/api/search', geoSearchRoutes);

// ==== PRESCRIPTION =====
const prescriptionRoutes = require('./routes/prescription.routes');

app.use('/api/prescription', prescriptionRoutes);



// ==== END-TO-END FLOW (PRESCRIPTION → PHARMACY → PRICE) ====
const flowRoutes = require('./routes/flow.routes');
app.use('/api/flow', flowRoutes);
