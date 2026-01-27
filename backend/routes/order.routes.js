// order.routes.js pura code
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { 
    createOrder, 
    getPharmacyStats, 
    getPharmacyOrders, 
    updateOrderStatus 
} = require('../controllers/order.controller');

router.get('/stats', protect, getPharmacyStats);
router.post('/create', protect, createOrder);
router.get('/pharmacy-orders', protect, getPharmacyOrders); // Controller wala function call karein
router.put('/status/:id', protect, updateOrderStatus);

module.exports = router;