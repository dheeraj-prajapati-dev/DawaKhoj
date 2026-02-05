const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const Pharmacy = require('../models/Pharmacy');

// 1. Create New Order (With Socket Alert to Pharmacy)
exports.createOrder = async (req, res) => {
    try {
        const { pharmacyId, medicineName, price } = req.body;

        const pharmacyInventory = await Inventory.find({ pharmacy: pharmacyId }).populate('medicine');
        const inventoryItem = pharmacyInventory.find(item => 
            item.medicine && item.medicine.name.toLowerCase() === medicineName.toLowerCase()
        );

        if (!inventoryItem || inventoryItem.stock <= 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Sorry, ye medicine out of stock hai!" 
            });
        }

        const newOrder = new Order({
            user: req.user._id,
            pharmacy: pharmacyId, 
            medicineName,
            price,
            status: 'Pending'
        });

        await newOrder.save();
        const populatedOrder = await Order.findById(newOrder._id).populate('user', 'name address phone');

        const io = req.app.get('socketio');
        io.to(pharmacyId.toString()).emit('new_order_alert', {
            message: "Naya Order Aaya Hai!",
            order: populatedOrder
        });

        res.status(201).json({ success: true, message: "Order placed successfully!" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 2. Dashboard Stats
exports.getPharmacyStats = async (req, res) => {
    try {
        const pharmacyProfile = await Pharmacy.findOne({ owner: req.user._id });
        if (!pharmacyProfile) return res.status(404).json({ success: false, message: "Pharmacy not found" });

        const pId = pharmacyProfile._id;
        const [totalMed, pendingOrd, outOfStockCount, lowStockCount] = await Promise.all([
            Inventory.countDocuments({ pharmacy: pId }),
            Order.countDocuments({ pharmacy: pId, status: 'Pending' }),
            Inventory.countDocuments({ pharmacy: pId, stock: 0 }),
            Inventory.countDocuments({ pharmacy: pId, stock: { $gt: 0, $lte: 5 } }) 
        ]);

        const completedOrders = await Order.find({ pharmacy: pId, status: 'Delivered' });
        const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.price || 0), 0);

        res.json({
            success: true,
            stats: {
                totalMedicines: totalMed,
                pendingOrders: pendingOrd,
                outOfStock: outOfStockCount,
                lowStock: lowStockCount, 
                revenue: totalRevenue,
                pharmacyId: pId
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 3. Fetch All Orders (Pharmacy Side)
exports.getPharmacyOrders = async (req, res) => {
    try {
        const pharmacyProfile = await Pharmacy.findOne({ owner: req.user._id });
        if (!pharmacyProfile) return res.json({ success: true, orders: [] });

        const orders = await Order.find({ pharmacy: pharmacyProfile._id })
            .populate('user', 'name phone address') 
            .sort({ createdAt: -1 });

        res.json({ success: true, orders });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 4. Update Status (Stock Deduction + Live Update)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const order = await Order.findById(orderId).populate('pharmacy', 'storeName');
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });

        if (status === 'Delivered') {
            const pharmacyInventory = await Inventory.find({ pharmacy: order.pharmacy }).populate('medicine');
            const inventoryItem = pharmacyInventory.find(item => 
                item.medicine && item.medicine.name.toLowerCase() === order.medicineName.toLowerCase()
            );

            if (inventoryItem && inventoryItem.stock > 0) {
                inventoryItem.stock -= 1;
                await inventoryItem.save();
            }
        }

        order.status = status;
        await order.save();

        const io = req.app.get('socketio');
        io.to(order.user.toString()).emit('order_status_update', {
            orderId: order._id,
            status: status,
            message: `Apka order ${order.pharmacy.storeName} ne ${status} kar diya hai!`
        });

        res.json({ success: true, message: `Order marked as ${status}!` });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 5. User Orders
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('pharmacy', 'storeName address phone')
            .sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 🔥 6. Rate Order (Naya Logic)
exports.rateOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { rating } = req.body;

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });
        if (order.status !== 'Delivered') return res.status(400).json({ success: false, message: "Pehle order deliver hone dein!" });
        if (order.isRated) return res.status(400).json({ success: false, message: "Already rated!" });

        // Order Update
        order.isRated = true;
        order.rating = rating;
        await order.save();

        // Pharmacy ki Average Rating Update logic
        const pId = order.pharmacy;
        const allRatedOrders = await Order.find({ pharmacy: pId, isRated: true });
        
        const avgRating = allRatedOrders.reduce((acc, curr) => acc + curr.rating, 0) / allRatedOrders.length;

        await Pharmacy.findByIdAndUpdate(pId, { 
            rating: avgRating.toFixed(1), // Average nikala
            numReviews: allRatedOrders.length // Total reviews count
        });

        res.json({ success: true, message: "Thank you for the rating!" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};