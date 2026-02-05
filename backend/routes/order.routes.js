const express = require('express');
const router = express.Router();
const { 
    createOrder, 
    getPharmacyStats, 
    getPharmacyOrders, 
    updateOrderStatus,
    getUserOrders,
    rateOrder // 👈 Naya function import kiya
} = require('../controllers/order.controller');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

// 1. User Routes
router.post('/create', protect, createOrder);
router.get('/my-orders', protect, getUserOrders);
router.post('/rate/:orderId', protect, rateOrder); // 👈 Naya Rating Route

// 2. Pharmacy Routes
router.get('/stats', protect, authorizeRoles('pharmacy'), getPharmacyStats);
router.get('/pharmacy-orders', protect, authorizeRoles('pharmacy'), getPharmacyOrders);
router.put('/status/:orderId', protect, authorizeRoles('pharmacy'), updateOrderStatus);

module.exports = router;