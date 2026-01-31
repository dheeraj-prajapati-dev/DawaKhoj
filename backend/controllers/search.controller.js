const Medicine = require('../models/Medicine');
const Inventory = require('../models/Inventory');
const Pharmacy = require('../models/Pharmacy');

exports.searchMedicinePrices = async (req, res) => {
  try {
    const { q } = req.query; // Lat/Lng ki zaroorat nahi abhi
    console.log("🔍 Dummy Search for:", q);

    // 1. Medicine dhoondo
    const medicines = await Medicine.find({
      $or: [
        { name: new RegExp(q, 'i') },
        { salt: new RegExp(q, 'i') }
      ]
    });

    if (!medicines.length) return res.json({ success: true, results: [] });

    // 2. Inventory dhoondo (Stock > 0)
    const inventories = await Inventory.find({
      medicine: { $in: medicines.map(m => m._id) },
      stock: { $gt: 0 }
    })
    .populate('medicine')
    .populate('pharmacy');

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

      return options.length > 0 ? { brand: med.name, options } : null;
    }).filter(g => g !== null);

    console.log(`✅ Search successful. Found ${finalResults.length} groups.`);
    res.status(200).json({ success: true, results: finalResults });
  } catch (err) {
    console.error("❌ Search Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};