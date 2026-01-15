const Inventory = require('../models/Inventory');
const Medicine = require('../models/Medicine');
const Pharmacy = require('../models/Pharmacy');

// ➕ ADD / UPDATE INVENTORY
exports.addOrUpdateInventory = async (req, res) => {
  try {
    const { medicineName, salt, category, price, stock } = req.body;

    // 🔐 VERIFICATION CHECK  
    if (!req.user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Pharmacy not verified by admin'
      });
    }


    const pharmacy = await Pharmacy.findOne({ owner: req.user._id });
    if (!pharmacy) {
      return res.status(404).json({ success: false, message: 'Pharmacy not found' });
    }

    let medicine = await Medicine.findOne({
      name: new RegExp(`^${medicineName}$`, 'i')
    });

    if (!medicine) {
      medicine = await Medicine.create({ name: medicineName, salt, category });
    }

    const inventory = await Inventory.findOneAndUpdate(
      { pharmacy: pharmacy._id, medicine: medicine._id },
      {
        price: Number(price),
        stock: Number(stock)
      },
      { new: true, upsert: true }
    );

    res.json({ success: true, inventory });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};


// 📦 GET MY INVENTORY
exports.getMyInventory = async (req, res) => {
  try {
    if (req.user.role !== 'pharmacy') {
      return res.status(403).json({ message: 'Only pharmacy allowed' });
    }

    // ❗ VERIFICATION CHECK
if (!req.user.isVerified) {
  return res.status(403).json({
    success: false,
    message: 'Pharmacy not verified by admin'
  });
}

    const pharmacy = await Pharmacy.findOne({ owner: req.user._id });
    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy not found' });
    }

    const inventory = await Inventory.find({ pharmacy: pharmacy._id })
      .populate('medicine', 'name salt category')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: inventory.length, inventory });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✏️ UPDATE INVENTORY
exports.updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const { price, stock } = req.body;

    if (req.user.role !== 'pharmacy') {
      return res.status(403).json({ message: 'Only pharmacy allowed' });
    }

    // ❗ VERIFICATION CHECK
if (!req.user.isVerified) {
  return res.status(403).json({
    success: false,
    message: 'Pharmacy not verified by admin'
  });
}



    const inventory = await Inventory.findById(id);
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory not found' });
    }

    if (price !== undefined) inventory.price = price;
    if (stock !== undefined) inventory.stock = stock;

    await inventory.save();

    res.json({ success: true, inventory });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❌ DELETE INVENTORY
exports.deleteInventory = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'pharmacy') {
      return res.status(403).json({ message: 'Only pharmacy allowed' });
    }

    // ❗ VERIFICATION CHECK
if (!req.user.isVerified) {
  return res.status(403).json({
    success: false,
    message: 'Pharmacy not verified by admin'
  });
}



    const inventory = await Inventory.findById(id);
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory not found' });
    }

    await inventory.deleteOne();

    res.json({ success: true, message: 'Inventory deleted' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
