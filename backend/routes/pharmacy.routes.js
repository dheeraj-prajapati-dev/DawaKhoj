const express = require('express');
const router = express.Router();

const {
  registerPharmacy,
  approvePharmacy,
  getVerifiedPharmacies,
  getNearestPharmacies
} = require('../controllers/pharmacy.controller');


const { protect, authorizeRoles } = require('../middleware/auth.middleware');

// 🏥 Register pharmacy
router.post('/register', protect, registerPharmacy);

// 👑 Admin approve pharmacy
router.put(
  '/approve/:pharmacyId',
  protect,
  authorizeRoles('admin'),
  approvePharmacy
);

// 🌍 Public route - get verified pharmacies
router.get('/verified', getVerifiedPharmacies);

// 📍 Get nearest verified pharmacies
router.get('/nearby', getNearestPharmacies);


module.exports = router;
