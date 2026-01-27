// order.routes.js pura code
const express = require('express');
const router = express.Router();
const { 
    createOrder, 
    getPharmacyStats, 
    getPharmacyOrders, 
    updateOrderStatus 
} = require('../controllers/order.controller');
const { protect } = require('../middlewares/authMiddleware');


router.get('/stats', protect, getPharmacyStats);
router.post('/create', protect, createOrder);
router.get('/pharmacy-orders', protect, getPharmacyOrders); // Controller wala function call karein
router.put('/status/:orderId', protect, updateOrderStatus);

module.exports = router;