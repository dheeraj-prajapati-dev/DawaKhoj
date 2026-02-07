const User = require('../models/User');
const Pharmacy = require('../models/Pharmacy');
const Order = require('../models/Order');

exports.getAllPharmacies = async (req, res) => {
  try {
    // 🚀 Parallel execution for speed
    const [userCount, pharmacyCount, pharmacies, revenueData] = await Promise.all([
      User.countDocuments({ role: { $in: ['user', 'patient'] } }),
      Pharmacy.countDocuments(),
      Pharmacy.find().populate('owner', 'email phone').sort({ createdAt: -1 }),
      // Database level par sum nikalna zyada fast hai
      Order.aggregate([
        { $match: { status: 'Delivered' } },
        { $group: { _id: null, total: { $sum: "$price" } } }
      ]),
      // Total orders count bina status filter ke
    Order.countDocuments()
    ]);

    
    

    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    res.json({
      success: true,
      stats: {
        totalUsers: userCount,
        totalPharmacies: pharmacyCount,
        totalRevenue: totalRevenue,
        totalOrders: await Order.countDocuments({ status: 'Delivered' }),
        pendingVerifications: pharmacies.filter(p => !p.isVerified).length
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
    const pharmacy = await Pharmacy.findByIdAndUpdate(
      id, 
      { isVerified: true }, 
      { new: true }
    );
    
    if (!pharmacy) return res.status(404).json({ message: 'Pharmacy not found' });
    res.json({ success: true, message: 'Pharmacy approved successfully! 🎉' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deletePharmacy = async (req, res) => {
  try {
    const { id } = req.params;
    // Basic safety: Verified pharmacy ko delete karne se pehle socho
    const pharmacy = await Pharmacy.findById(id);
    if (!pharmacy) return res.status(404).json({ success: false, message: 'Pharmacy nahi mili' });

    await Pharmacy.findByIdAndDelete(id);
    res.json({ success: true, message: 'Pharmacy record removed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};