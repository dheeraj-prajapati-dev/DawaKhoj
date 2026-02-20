const Medicine = require('../models/Medicine');
const mongoose = require('mongoose');

exports.getMedicineById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid Product ID" });
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

        // Send back with clean string ID
        const result = { ...medicine[0], _id: medicine[0]._id.toString() };
        res.json({ success: true, medicine: result });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.query;
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
                    _id: { $toString: "$_id" }, 
                    name: 1,
                    brand: 1,
                    image: 1,
                    category: 1,
                    salt: 1,
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