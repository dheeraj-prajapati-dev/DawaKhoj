const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const {
  getUnverifiedPharmacies,
  approvePharmacy
} = require('../controllers/pharmacy.controller');

router.get(
  '/pharmacies',
  protect,
  authorizeRoles('admin'),
  getUnverifiedPharmacies
);

router.put(
  '/pharmacy/approve/:pharmacyId',
  protect,
  authorizeRoles('admin'),
  approvePharmacy
);

module.exports = router;
