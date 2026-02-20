const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicine.controller');

// ✅ Public Routes
router.get('/search', medicineController.getProductsByCategory);
router.get("/:id", medicineController.getMedicineById);

module.exports = router;