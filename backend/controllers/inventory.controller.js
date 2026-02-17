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
const NEW_PLACEHOLDER = 'https://placehold.co/300x300/1e293b/475569?text=Medicine';

exports.addOrUpdateInventory = async (req, res) => {
    try {
        const pharmacy = await getVerifiedPharmacy(req.user._id);
        const { medicineName, salt, category, price, stock, brand, image } = req.body;

        let medicine = await Medicine.findOne({ name: new RegExp(`^${medicineName.trim()}$`, 'i') });

        if (!medicine) {
            medicine = await Medicine.create({ 
                name: medicineName.trim(), 
                salt: salt || "N/A", 
                category: category || "OTC", 
                brand: brand || "",
                // Use new placeholder if no image provided
                image: image || NEW_PLACEHOLDER
            });
        } else {
            // Agar purana broken image link hai ya blank hai, toh update karein
            if (image) {
                medicine.image = image;
            } else if (!medicine.image || medicine.image.includes('via.placeholder')) {
                medicine.image = NEW_PLACEHOLDER;
            }
            
            if (category) medicine.category = category;
            await medicine.save();
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

// 🚀 BULK UPLOAD (CSV Parser - Support for Image & Category)
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
                        // 1. Medicine ensure karein (with image and category from CSV)
                        let medicine = await Medicine.findOne({ name: new RegExp(`^${item.name.trim()}$`, 'i') });
                        
                        if (!medicine) {
                            medicine = await Medicine.create({
                                name: item.name.trim(),
                                brand: item.brand || "",
                                salt: item.salt || "N/A",
                                category: item.category || "OTC",
                                image: item.image || 'https://via.placeholder.com/300?text=Medicine'
                            });
                        } else {
                            // Bulk mein bhi photo update kar sakte hain
                            if (item.image) medicine.image = item.image;
                            if (item.category) medicine.category = item.category;
                            await medicine.save();
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
                    fs.unlinkSync(req.file.path); 
                    res.json({ success: true, message: `${results.length} items processed successfully!` });
                } catch (dbErr) {
                    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
                    res.status(500).json({ message: "DB Error during bulk upload", error: dbErr.message });
                }
            });
    } catch (err) {
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(err.status || 500).json({ message: err.message });
    }
};

// ✏️ UPDATE ITEM
exports.updateInventory = async (req, res) => {
    try {
        const pharmacy = await getVerifiedPharmacy(req.user._id);
        const { price, stock, image } = req.body;

        const inventory = await Inventory.findOneAndUpdate(
            { _id: req.params.id, pharmacy: pharmacy._id },
            { price: Number(price), stock: Number(stock) },
            { new: true }
        ).populate('medicine');

        if (!inventory) return res.status(404).json({ message: 'Unauthorized or not found' });

        // Agar edit modal se image URL change kiya hai
        if (image && inventory.medicine) {
            await Medicine.findByIdAndUpdate(inventory.medicine._id, { image });
        }

        res.json({ success: true, inventory });
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
};

// ❌ DELETE ITEM
exports.deleteInventory = async (req, res) => {
    try {
        const pharmacy = await getVerifiedPharmacy(req.user._id);
        const inventory = await Inventory.findOneAndDelete({ _id: req.params.id, pharmacy: pharmacy._id });
        if (!inventory) return res.status(404).json({ message: 'Not found' });
        res.json({ success: true, message: "Deleted from your inventory" });
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}; 