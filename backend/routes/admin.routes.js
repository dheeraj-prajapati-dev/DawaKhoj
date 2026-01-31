const express = require('express');
const router = express.Router();

// Middleware aur Controller functions ko import kiya
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const {
  getAllPharmacies, // Ye wahi function hai jo ab stats + pharmacies dono bhejega
  approvePharmacy
} = require('../controllers/admin.controller');

// ✅ GET ALL PHARMACIES & STATS
// Frontend service: axios.get('/api/admin/pharmacies') isi route ko hit karegi
router.get(
  '/pharmacies',
  protect,
  authorizeRoles('admin'),
  getAllPharmacies
);

// ✅ APPROVE PHARMACY
// Frontend service: axios.put(`/api/admin/pharmacy/approve/${id}`)
router.put(
  '/pharmacy/approve/:id',
  protect,
  authorizeRoles('admin'),
  approvePharmacy
);

module.exports = router;