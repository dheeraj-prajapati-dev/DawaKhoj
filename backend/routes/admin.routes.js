const express = require('express');
const router = express.Router();

const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const {
  getAllPharmacies,
  approvePharmacy
} = require('../controllers/admin.controller');

// ✅ GET ALL PHARMACIES
router.get(
  '/pharmacies',
  protect,
  authorizeRoles('admin'),
  getAllPharmacies
);

// ✅ APPROVE PHARMACY
router.put(
  '/pharmacy/approve/:id',
  protect,
  authorizeRoles('admin'),
  approvePharmacy
);

module.exports = router;
