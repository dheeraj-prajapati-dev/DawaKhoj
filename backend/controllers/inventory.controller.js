const Inventory = require('../models/Inventory');
const Medicine = require('../models/Medicine');
const Pharmacy = require('../models/Pharmacy');

// helper function
const getVerifiedPharmacy = async (userId) => {
  const pharmacy = await Pharmacy.findOne({ owner: userId });
  if (!pharmacy) {
    throw { status: 404, message: 'Pharmacy not found' };
  }
  if (!pharmacy.isVerified) {
    throw { status: 403, message: 'Pharmacy not verified by admin' };
  }
  return pharmacy;
};

// ➕ ADD / UPDATE INVENTORY
exports.addOrUpdateInventory = async (req, res) => {
  try {
    if (req.user.role !== 'pharmacy') {
      return res.status(403).json({ message: 'Only pharmacy allowed' });
    }

    const pharmacy = await getVerifiedPharmacy(req.user._id);

    const { medicineName, salt, category, price, stock } = req.body;

    let medicine = await Medicine.findOne({
      name: new RegExp(`^${medicineName}$`, 'i')
    });

    if (!medicine) {
      medicine = await Medicine.create({ name: medicineName, salt, category });
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

// 📦 GET MY INVENTORY (view allowed even if not verified)
exports.getMyInventory = async (req, res) => {
  try {
    if (req.user.role !== 'pharmacy') {
      return res.status(403).json({ message: 'Only pharmacy allowed' });
    }

    const pharmacy = await Pharmacy.findOne({ owner: req.user._id });
    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy not found' });
    }

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
      return res.status(403).json({ message: 'Only pharmacy allowed' });
    }

    await getVerifiedPharmacy(req.user._id);

    const inventory = await Inventory.findById(req.params.id);
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory not found' });
    }

    inventory.price = req.body.price ?? inventory.price;
    inventory.stock = req.body.stock ?? inventory.stock;
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
      return res.status(403).json({ message: 'Only pharmacy allowed' });
    }

    await getVerifiedPharmacy(req.user._id);

    const inventory = await Inventory.findById(req.params.id);
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory not found' });
    }

    await inventory.deleteOne();
    res.json({ success: true });

  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};
