const express = require('express');
const router = express.Router();

const { addOrUpdateInventory } = require('../controllers/inventory.controller');
const { protect, authorizeRoles } = require('../middleware/auth.middleware');

// 🧾 Add / Update inventory (pharmacy only)
router.post(
  '/add',
  protect,
  authorizeRoles('pharmacy'),
  addOrUpdateInventory
);

module.exports = router;
