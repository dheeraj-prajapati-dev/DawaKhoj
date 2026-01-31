const Medicine = require('../models/Medicine');
const Inventory = require('../models/Inventory');
const Pharmacy = require('../models/Pharmacy');

exports.searchMedicinePrices = async (req, res) => {
  try {
    const { q } = req.query;
    console.log("🔍 Search for:", q);

    // 1. Medicine dhoondo
    const medicines = await Medicine.find({
      $or: [
        { name: new RegExp(q, 'i') },
        { salt: new RegExp(q, 'i') }
      ]
    });

    if (!medicines.length) return res.json({ success: true, results: [] });

    // 2. Inventory dhoondo (Stock > 0) + SORTING ADDED HERE
    const inventories = await Inventory.find({
      medicine: { $in: medicines.map(m => m._id) },
      stock: { $gt: 0 }
    })
    .populate('medicine')
    .populate('pharmacy')
    .sort({ price: 1 }); // ✅ 1 matlab Lowest Price Sabse Upar

    // 3. Format & Group results
    const finalResults = medicines.map(med => {
      const options = inventories
        .filter(inv => inv.pharmacy && inv.medicine._id.toString() === med._id.toString())
        .map(inv => ({
          pharmacyId: inv.pharmacy._id,
          pharmacy: inv.pharmacy.storeName,
          medicineName: inv.medicine.name,
          salt: inv.medicine.salt,
          price: inv.price,
          stock: inv.stock
        }));

      // Map karne ke baad bhi ek baar confirm kar lete hain ki sasta upar rahe
      options.sort((a, b) => a.price - b.price);

      return options.length > 0 ? { brand: med.name, options } : null;
    }).filter(g => g !== null);

    // ====== SOCKET NOTIFICATION LOGIC ======
    const io = req.app.get('socketio');
    if (io && finalResults.length > 0) {
      // Ye sabhi connected pharmacies ya admin ko batayega ki kisi ne search kiya hai
      io.emit('search_alert', {
        message: `🔍 Kisi ne "${q}" dawa search ki hai!`,
        timestamp: new Date()
      });
    }
    // ========================================

    console.log(`✅ Search successful. Found ${finalResults.length} groups.`);
    res.status(200).json({ success: true, results: finalResults });
  } catch (err) {
    console.error("❌ Search Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};