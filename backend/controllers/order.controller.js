const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const Pharmacy = require('../models/Pharmacy');

// 1. Create New Order
exports.createOrder = async (req, res) => {
    try {
        const { pharmacyId, medicineName, price } = req.body;

        // 1. Check karo ki kya ye medicine stock mein hai?
        const pharmacyInventory = await Inventory.find({ pharmacy: pharmacyId }).populate('medicine');
        const inventoryItem = pharmacyInventory.find(item => 
            item.medicine && item.medicine.name.toLowerCase() === medicineName.toLowerCase()
        );

        if (!inventoryItem || inventoryItem.stock <= 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Sorry, ye medicine abhi out of stock ho gayi hai!" 
            });
        }

        // 2. Agar stock hai, tabhi order create karo
        const newOrder = new Order({
            user: req.user._id,
            pharmacy: pharmacyId, 
            medicineName,
            price,
            status: 'Pending'
        });

        await newOrder.save();

        const populatedOrder = await Order.findById(newOrder._id).populate('user', 'name address');

        // Socket trigger
const io = req.app.get('socketio');
io.to(pharmacyId).emit('new_order_alert', {
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
                revenue: totalRevenue
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 3. Fetch All Orders
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

// 4. Update Status (CORRECTED DATABASE LOGIC)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const order = await Order.findById(orderId).populate('pharmacy', 'storeName' );
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });

        if (status === 'Delivered') {
            // Step 1: Sari inventory leke aao aur Medicine details populate karo
            const pharmacyInventory = await Inventory.find({ pharmacy: order.pharmacy }).populate('medicine');

            // Step 2: Loop chalao check karne ke liye ki konsi medicine ka naam match hota hai
            const inventoryItem = pharmacyInventory.find(item => 
                item.medicine && item.medicine.name.toLowerCase() === order.medicineName.toLowerCase()
            );

            if (!inventoryItem) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Medicine '${order.medicineName}' aapki inventory mein nahi hai!` 
                });
            }

            if (inventoryItem.stock <= 0) {
                return res.status(400).json({ success: false, message: "Stock 0 hai, delivery nahi ho sakti!" });
            }

            // Step 3: Stock deduct karo
            inventoryItem.stock -= 1;
            await inventoryItem.save();
        }

        // Status update hamesha chalega (Accepted ke liye bhi aur Delivered ke liye bhi)
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
        console.error("Update Error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};



// 5. User apne orders dekh sake
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