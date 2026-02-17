const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicine.controller');

// ✅ Public route for searching medicines by category
router.get('/search', medicineController.getProductsByCategory);

module.exports = router;