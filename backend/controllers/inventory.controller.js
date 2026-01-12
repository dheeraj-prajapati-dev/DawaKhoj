const Inventory = require('../models/Inventory');
const Medicine = require('../models/Medicine');
const Pharmacy = require('../models/Pharmacy');

// ➕ ADD / UPDATE MEDICINE IN INVENTORY
exports.addOrUpdateInventory = async (req, res) => {
  try {
    const { medicineName, salt, category, price, stock } = req.body;

    // Only pharmacy users
    if (req.user.role !== 'pharmacy') {
      return res.status(403).json({ message: 'Only pharmacy can manage inventory' });
    }

    // Find pharmacy of logged-in user
    const pharmacy = await Pharmacy.findOne({ owner: req.user._id });
    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy not found for this user' });
    }

    // Find or create medicine
    let medicine = await Medicine.findOne({ name: medicineName });
    if (!medicine) {
      medicine = await Medicine.create({
        name: medicineName,
        salt,
        category
      });
    }

    // Add or update inventory
    const inventory = await Inventory.findOneAndUpdate(
      {
        pharmacy: pharmacy._id,
        medicine: medicine._id
      },
      {
        price,
        stock
      },
      {
        new: true,
        upsert: true
      }
    );

    res.json({
      message: 'Inventory updated successfully',
      inventory
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
