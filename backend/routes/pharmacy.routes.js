const express = require('express');
const router = express.Router();

const {
  registerPharmacy,
  approvePharmacy,
  getVerifiedPharmacies,
  getNearestPharmacies,
  getMyProfile
} = require('../controllers/pharmacy.controller');

const { getMyPharmacy } = require('../controllers/pharmacy.controller');

const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

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

router.get(
  '/me',
  protect,
  authorizeRoles('pharmacy'),
  getMyProfile
);



module.exports = router;
