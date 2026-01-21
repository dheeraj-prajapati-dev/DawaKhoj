const express = require('express');
const router = express.Router();

const {
  addOrUpdateInventory,
  getMyInventory,
  updateInventory,
  deleteInventory
} = require('../controllers/inventory.controller');

const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const { requireVerifiedPharmacy } = require('../middlewares/verifiedMiddleware');

// ✅ FINAL & CORRECT
router.post(
  '/add',
  protect,
  authorizeRoles('pharmacy'),
  requireVerifiedPharmacy,
  addOrUpdateInventory
);

router.get(
  '/my',
  protect,
  authorizeRoles('pharmacy'),
  getMyInventory
);

router.put(
  '/update/:id',
  protect,
  authorizeRoles('pharmacy'),
  requireVerifiedPharmacy,
  updateInventory
);

router.delete(
  '/delete/:id',
  protect,
  authorizeRoles('pharmacy'),
  requireVerifiedPharmacy,
  deleteInventory
);

module.exports = router;
