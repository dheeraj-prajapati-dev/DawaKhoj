const User = require('../models/User');
const Pharmacy = require('../models/Pharmacy');
const Order = require('../models/Order');

// Iska naam wahi rakha jo router mein use ho raha hai
exports.getAllPharmacies = async (req, res) => {
  try {
    const [userCount, pharmacyCount, pharmacies, orders] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Pharmacy.countDocuments(),
      Pharmacy.find().populate('owner', 'email phone').sort({ createdAt: -1 }),
      Order.find({ status: 'Delivered' })
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + (o.price || 0), 0);

    res.json({
      success: true,
      stats: { // Ye backend se stats bhej raha hai frontend ko
        totalUsers: userCount,
        totalPharmacies: pharmacyCount,
        totalRevenue: totalRevenue
      },
      pharmacies
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.approvePharmacy = async (req, res) => {
  try {
    const { id } = req.params;
    const pharmacy = await Pharmacy.findById(id);
    if (!pharmacy) return res.status(404).json({ message: 'Pharmacy not found' });

    pharmacy.isVerified = true;
    await pharmacy.save();

    res.json({ success: true, message: 'Pharmacy approved' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};