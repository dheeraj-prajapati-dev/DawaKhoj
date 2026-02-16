const User = require('../models/User');
const Pharmacy = require('../models/Pharmacy');
const Order = require('../models/Order');

exports.getAllPharmacies = async (req, res) => {
  try {
    // 📊 Perfect Date Logic for IST
    const now = new Date();
    // Aaj se 7 din pehle ki date nikalna (IST safe)
    const startDate = new Date();
    startDate.setDate(now.getDate() - 7);
    startDate.setHours(0, 0, 0, 0); 

    const [userCount, pharmacyCount, pharmacies, revenueData, orderStats] = await Promise.all([
      User.countDocuments({ role: { $in: ['user', 'patient'] } }),
      Pharmacy.countDocuments(),
      Pharmacy.find().populate('owner', 'email phone').sort({ createdAt: -1 }),
      Order.aggregate([
        { $match: { status: "Delivered" } },
        { $group: { _id: null, total: { $sum: "$price" } } }
      ]),
      // 📈 Chart Aggregation (Live Updates based on IST)
      Order.aggregate([
        {
          $match: {
            status: "Delivered", 
            createdAt: { $gte: startDate } 
          }
        },
        {
          $group: {
            _id: { 
              $dateToString: { 
                format: "%Y-%m-%d", 
                date: "$createdAt",
                timezone: "+05:30" 
              } 
            },
            orders: { $sum: 1 }
          }
        },
        { $sort: { "_id": 1 } }
      ])
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers: userCount,
        totalPharmacies: pharmacyCount,
        totalRevenue: revenueData.length > 0 ? revenueData[0].total : 0,
        totalOrders: await Order.countDocuments({ status: "Delivered" }),
        chartData: orderStats 
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
    const pharmacy = await Pharmacy.findByIdAndUpdate(id, { isVerified: true }, { new: true });
    if (!pharmacy) return res.status(404).json({ message: 'Pharmacy not found' });
    res.json({ success: true, message: 'Pharmacy approved successfully! 🎉' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deletePharmacy = async (req, res) => {
  try {
    const { id } = req.params;
    await Pharmacy.findByIdAndDelete(id);
    res.json({ success: true, message: 'Pharmacy record removed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};