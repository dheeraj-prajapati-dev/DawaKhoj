const Medicine = require('../models/Medicine');
const mongoose = require('mongoose');

exports.getMedicineById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid ID Format" });
        }

        const medicine = await Medicine.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id) } },
            {
                $lookup: {
                    from: 'inventories',
                    localField: '_id',
                    foreignField: 'medicine',
                    as: 'inventory_data'
                }
            },
            {
                $addFields: {
                    price: { $ifNull: [{ $min: "$inventory_data.price" }, "$price"] },
                    stock: { $ifNull: [{ $sum: "$inventory_data.stock" }, 0] }
                }
            }
        ]);

        if (!medicine || medicine.length === 0) {
            return res.status(404).json({ success: false, message: "Asset not found" });
        }

        res.json({ success: true, medicine: medicine[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.query;
        if (!category) return res.status(400).json({ success: false, message: "Category required" });

        const products = await Medicine.aggregate([
            { $match: { category: { $regex: new RegExp(`^${category}$`, 'i') } } },
            {
                $lookup: {
                    from: 'inventories',
                    localField: '_id',
                    foreignField: 'medicine',
                    as: 'inventory_data'
                }
            },
            {
                $project: {
                    _id: 1, // Keep as ObjectId for frontend .toString()
                    name: 1,
                    brand: 1,
                    image: 1,
                    category: 1,
                    price: { $ifNull: [{ $min: "$inventory_data.price" }, 0] },
                    stock: { $ifNull: [{ $sum: "$inventory_data.stock" }, 0] }
                }
            }
        ]);
        res.json({ success: true, products });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};