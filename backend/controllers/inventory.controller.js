const Inventory = require('../models/Inventory');
const Medicine = require('../models/Medicine');
const Pharmacy = require('../models/Pharmacy');

// ✅ HELPER FUNCTION: Bridge between User ID and Pharmacy Profile
const getVerifiedPharmacy = async (userId) => {
  const pharmacy = await Pharmacy.findOne({ owner: userId }); //
  if (!pharmacy) {
    throw { status: 404, message: 'Pharmacy profile not found. Please create one.' };
  }
  if (!pharmacy.isVerified) {
    throw { status: 403, message: 'Pharmacy not verified by admin yet.' };
  }
  return pharmacy;
};

// ➕ ADD / UPDATE INVENTORY
exports.addOrUpdateInventory = async (req, res) => {
  try {
    if (req.user.role !== 'pharmacy') {
      return res.status(403).json({ message: 'Only pharmacy role can perform this action' });
    }

    const pharmacy = await getVerifiedPharmacy(req.user._id); //

    const { medicineName, salt, category, price, stock } = req.body;

    // Medicine find or create (Case-insensitive)
    let medicine = await Medicine.findOne({
      name: new RegExp(`^${medicineName}$`, 'i')
    });

    if (!medicine) {
      medicine = await Medicine.create({ name: medicineName, salt, category });
    }

    // Pharmacy ID use karke inventory update karein
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
    if (req.user.role !== 'pharmacy') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Owner ID se Pharmacy dhoondein
    const pharmacy = await Pharmacy.findOne({ owner: req.user._id });
    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy profile not found' });
    }

    // Sirf is pharmacy ki inventory laayein
    const inventory = await Inventory.find({ pharmacy: pharmacy._id })
      .populate('medicine', 'name salt category')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      isVerified: pharmacy.isVerified,
      inventory
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✏️ UPDATE INVENTORY
exports.updateInventory = async (req, res) => {
  try {
    if (req.user.role !== 'pharmacy') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const pharmacy = await getVerifiedPharmacy(req.user._id);

    // ✅ Security Fix: Pehle check karein inventory item is pharmacy ka hai ya nahi
    const inventory = await Inventory.findOne({ 
      _id: req.params.id, 
      pharmacy: pharmacy._id 
    });

    if (!inventory) {
      return res.status(404).json({ message: 'Inventory item not found or unauthorized' });
    }

    inventory.price = req.body.price !== undefined ? Number(req.body.price) : inventory.price;
    inventory.stock = req.body.stock !== undefined ? Number(req.body.stock) : inventory.stock;
    
    await inventory.save();
    res.json({ success: true, inventory });

  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

// ❌ DELETE INVENTORY
exports.deleteInventory = async (req, res) => {
  try {
    if (req.user.role !== 'pharmacy') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const pharmacy = await getVerifiedPharmacy(req.user._id);

    // ✅ Security Fix: Ensure ownership before deleting
    const inventory = await Inventory.findOneAndDelete({ 
      _id: req.params.id, 
      pharmacy: pharmacy._id 
    });

    if (!inventory) {
      return res.status(404).json({ message: 'Inventory item not found or unauthorized' });
    }

    res.json({ success: true, message: "Item deleted successfully" });

  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};