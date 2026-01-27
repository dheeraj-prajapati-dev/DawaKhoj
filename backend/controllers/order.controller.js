const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const Pharmacy = require('../models/Pharmacy');

// 1. Naya Order Create karna (User Side)
exports.createOrder = async (req, res) => {
    try {
        const { pharmacyId, medicineName, price } = req.body;
        
        const newOrder = new Order({
            user: req.user._id,
            pharmacy: pharmacyId, 
            medicineName,
            price,
            status: 'Pending'
        });

        await newOrder.save();
        res.status(201).json({ success: true, message: "Order placed successfully!" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 2. Dashboard ke Stats fetch karna (Pharmacy Side)
exports.getPharmacyStats = async (req, res) => {
    try {
        const pharmacyProfile = await Pharmacy.findOne({ owner: req.user._id });
        
        if (!pharmacyProfile) {
            return res.status(404).json({ success: false, message: "Pharmacy not found" });
        }

        const pId = pharmacyProfile._id;

        const [totalMed, pendingOrd, outOfStock] = await Promise.all([
            Inventory.countDocuments({ pharmacy: pId }),
            Order.countDocuments({ pharmacy: pId, status: 'Pending' }),
            Inventory.countDocuments({ pharmacy: pId, stock: 0 })
        ]);

        const completedOrders = await Order.find({ pharmacy: pId, status: 'Delivered' });
        const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.price || 0), 0);

        res.json({
            success: true,
            stats: {
                totalMedicines: totalMed,
                pendingOrders: pendingOrd,
                outOfStock: outOfStock,
                revenue: totalRevenue
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 3. Pharmacy ke saare Orders fetch karna
exports.getPharmacyOrders = async (req, res) => {
    try {
        const pharmacyProfile = await Pharmacy.findOne({ owner: req.user._id });

        if (!pharmacyProfile) {
            return res.json({ success: true, orders: [] });
        }

        const orders = await Order.find({ pharmacy: pharmacyProfile._id })
            .populate('user', 'name phone') 
            .sort({ createdAt: -1 });

        res.json({ success: true, orders });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 4. Order Status Update (Isme Check Logic Add Kiya Hai)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const pharmacyProfile = await Pharmacy.findOne({ owner: req.user._id });

        if (!pharmacyProfile) {
            return res.status(404).json({ success: false, message: "Pharmacy profile missing" });
        }

        const order = await Order.findOne({ _id: req.params.id, pharmacy: pharmacyProfile._id });

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // --- ACCURATE STOCK UPDATE LOGIC ---
        if (status === 'Delivered' && order.status !== 'Delivered') {
            const orderMedName = order.medicineName.trim().toLowerCase();
            
            // 1. Inventory fetch karein aur linked 'medicine' collection se 'name' mangwayein
            const inventoryItems = await Inventory.find({ pharmacy: pharmacyProfile._id })
                                                  .populate('medicine'); 

            // 2. Populated data mein match dhoondhein
            const inventoryItem = inventoryItems.find(item => {
                // Compass ke mutabik: item.medicine object hai jisme 'name' field hai
                const dbMedName = (item.medicine && item.medicine.name) 
                                  ? item.medicine.name.trim().toLowerCase() 
                                  : null;
                return dbMedName === orderMedName;
            });

            if (inventoryItem) {
                if (inventoryItem.stock > 0) {
                    inventoryItem.stock -= 1; // Stock ek se kam karein
                    await inventoryItem.save();
                    console.log(`✅ Stock Updated: ${order.medicineName} | New Stock: ${inventoryItem.stock}`);
                } else {
                    console.log(`⚠️ Stock low for ${order.medicineName}, but status updated.`);
                }
            } else {
                // Debugging ke liye agar match na ho
                console.log(`❌ Inventory Match Failed for: "${orderMedName}"`);
                console.log("DB Available:", inventoryItems.map(i => i.medicine?.name));
            }
        }

        // 3. Status update hamesha hoga
        order.status = status;
        await order.save();

        res.json({ success: true, message: `Order marked as ${status}`, order });
    } catch (err) {
        console.error("Critical Update Error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};