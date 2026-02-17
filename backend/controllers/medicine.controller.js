const Medicine = require('../models/Medicine');
const Inventory = require('../models/Inventory');
const mongoose = require('mongoose');

exports.getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.query;
        if (!category) return res.status(400).json({ success: false, message: "Category is required" });

        // Step 1: Find Medicines in this category
        const products = await Medicine.aggregate([
            { $match: { category: new RegExp(`^${category}$`, 'i') } },
            {
                $lookup: {
                    from: 'inventories', // Inventory collection se join
                    localField: '_id',
                    foreignField: 'medicine',
                    as: 'inventory_data'
                }
            },
            {
                $addFields: {
                    // Agar inventory mein price hai toh min price uthao, warna model ka default price
                    price: { $ifNull: [{ $min: "$inventory_data.price" }, "$price"] },
                    inStock: { $gt: [{ $size: "$inventory_data" }, 0] }
                }
            },
            { $sort: { createdAt: -1 } }
        ]);

        res.json({ success: true, products });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};