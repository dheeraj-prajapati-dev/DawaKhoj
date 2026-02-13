const Inventory = require('../models/Inventory');
const Medicine = require('../models/Medicine');
const Pharmacy = require('../models/Pharmacy');
const fs = require('fs');
const csv = require('csv-parser');

// ✅ HELPER: Pharmacy Profile Check
const getVerifiedPharmacy = async (userId) => {
    const pharmacy = await Pharmacy.findOne({ owner: userId });
    if (!pharmacy) throw { status: 404, message: 'Pharmacy profile banayein pehle.' };
    if (!pharmacy.isVerified) throw { status: 403, message: 'Admin verification pending hai.' };
    return pharmacy;
};

// ➕ ADD / UPDATE SINGLE ITEM
exports.addOrUpdateInventory = async (req, res) => {
    try {
        const pharmacy = await getVerifiedPharmacy(req.user._id);
        const { medicineName, salt, category, price, stock, brand } = req.body;

        // Smart Find/Create Medicine
        let medicine = await Medicine.findOne({ name: new RegExp(`^${medicineName}$`, 'i') });

        if (!medicine) {
            medicine = await Medicine.create({ 
                name: medicineName, 
                salt: salt || "N/A", 
                category, 
                brand 
            });
        }

        const inventory = await Inventory.findOneAndUpdate(
            { pharmacy: pharmacy._id, medicine: medicine._id },
            { price: Number(price), stock: Number(stock) },
            { new: true, upsert: true }
        );

        res.json({ success: true, inventory });
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
};

// 📦 GET MY INVENTORY
exports.getMyInventory = async (req, res) => {
    try {
        const pharmacy = await Pharmacy.findOne({ owner: req.user._id });
        if (!pharmacy) return res.status(404).json({ message: 'Pharmacy not found' });

        const inventory = await Inventory.find({ pharmacy: pharmacy._id })
            .populate('medicine')
            .sort({ createdAt: -1 });

        res.json({ success: true, isVerified: pharmacy.isVerified, inventory });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🚀 BULK UPLOAD (CSV Parser)
exports.bulkUploadInventory = async (req, res) => {
    try {
        const pharmacy = await getVerifiedPharmacy(req.user._id);
        const results = [];

        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                try {
                    for (const item of results) {
                        // 1. Medicine ensure karein
                        let medicine = await Medicine.findOne({ name: new RegExp(`^${item.name}$`, 'i') });
                        if (!medicine) {
                            medicine = await Medicine.create({
                                name: item.name,
                                brand: item.brand,
                                salt: item.salt || "N/A",
                                category: item.category || "OTC"
                            });
                        }

                        // 2. Inventory entry karein
                        await Inventory.findOneAndUpdate(
                            { pharmacy: pharmacy._id, medicine: medicine._id },
                            { 
                                price: Number(item.price) || 0, 
                                stock: Number(item.stock) || 0 
                            },
                            { upsert: true }
                        );
                    }
                    fs.unlinkSync(req.file.path); // Temp file delete
                    res.json({ success: true, message: `${results.length} items processed!` });
                } catch (dbErr) {
                    res.status(500).json({ message: "DB Error during bulk upload", error: dbErr.message });
                }
            });
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
};

// ✏️ UPDATE & ❌ DELETE (Stayed Same but with Ownership Check)
exports.updateInventory = async (req, res) => {
    try {
        const pharmacy = await getVerifiedPharmacy(req.user._id);
        const inventory = await Inventory.findOneAndUpdate(
            { _id: req.params.id, pharmacy: pharmacy._id },
            { price: Number(req.body.price), stock: Number(req.body.stock) },
            { new: true }
        );
        if (!inventory) return res.status(404).json({ message: 'Unauthorized or not found' });
        res.json({ success: true, inventory });
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
};

exports.deleteInventory = async (req, res) => {
    try {
        const pharmacy = await getVerifiedPharmacy(req.user._id);
        const inventory = await Inventory.findOneAndDelete({ _id: req.params.id, pharmacy: pharmacy._id });
        if (!inventory) return res.status(404).json({ message: 'Not found' });
        res.json({ success: true, message: "Deleted" });
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
};