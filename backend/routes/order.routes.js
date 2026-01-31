const express = require('express');
const router = express.Router();
const { 
    createOrder, 
    getPharmacyStats, 
    getPharmacyOrders, 
    updateOrderStatus,
    getUserOrders // 👈 Ye naya function add kiya
} = require('../controllers/order.controller');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

// 1. User Routes (Koi bhi logged-in user)
router.post('/create', protect, createOrder);
router.get('/my-orders', protect, getUserOrders); // User apne orders dekh sake

// 2. Pharmacy Routes (Sirf Pharmacy owner ke liye)
router.get('/stats', protect, authorizeRoles('pharmacy'), getPharmacyStats);
router.get('/pharmacy-orders', protect, authorizeRoles('pharmacy'), getPharmacyOrders);
router.put('/status/:orderId', protect, authorizeRoles('pharmacy'), updateOrderStatus);

module.exports = router;