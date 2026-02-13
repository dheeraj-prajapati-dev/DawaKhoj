const Pharmacy = require('../models/Pharmacy');
const Inventory = require('../models/Inventory');
const Medicine = require('../models/Medicine');

exports.findNearestPharmacies = async (req, res) => {
  try {
    const { lat, lng, q, category } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: 'Location required' });
    }

    // 1. Medicine Search Logic (Strict AND Condition)
    let andConditions = [];

    // Category Filter: Case-insensitive handle karne ke liye Regex use kar sakte hain
    if (category && category !== 'All' && category !== 'undefined') {
      const cleanCategory = decodeURIComponent(category).trim();
      // Regex use kar rahe hain taaki 'Baby Care' aur 'baby care' dono match ho jayein safety ke liye
      andConditions.push({ category: { $regex: new RegExp(`^${cleanCategory}$`, 'i') } });
    }

    // Search Text Filter
    if (q && q.trim().length > 0) {
      const searchText = q.trim();
      andConditions.push({
        $or: [
          { name: { $regex: searchText, $options: 'i' } },
          { salt: { $regex: searchText, $options: 'i' } }
        ]
      });
    }

    let medicineCriteria = andConditions.length > 0 ? { $and: andConditions } : {};

    // DEBUGGING: Check karo backend kya filter kar raha hai
    console.log("🛠️ DB Query Criteria:", JSON.stringify(medicineCriteria));

    // 2. Filtered Medicines dhoondho
    const matchedMedicines = await Medicine.find(medicineCriteria).limit(50);
    
    if (!matchedMedicines.length) {
      return res.json({ success: true, results: [], message: "No medicines matched these filters." });
    }

    const medicineIds = matchedMedicines.map(m => m._id);

    // 3. Nearby Pharmacies Aggregation
    const nearbyPharmacies = await Pharmacy.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          distanceField: "distance",
          spherical: true,
          maxDistance: 50000,
          distanceMultiplier: 0.001,
          query: { isVerified: true }
        }
      }
    ]);

    if (!nearbyPharmacies.length) return res.json({ success: true, results: [] });

    const pharmacyIds = nearbyPharmacies.map(p => p._id);

    // 4. Inventory Search (Population with match for double safety)
    const inventoryItems = await Inventory.find({
      pharmacy: { $in: pharmacyIds },
      medicine: { $in: medicineIds },
      stock: { $gt: 0 }
    }).populate('medicine pharmacy');

    // 5. Grouping Logic
    const grouped = {};
    inventoryItems.forEach(item => {
      // Safety check: Agar populate fail hua ya medicine delete ho gayi
      if (!item.medicine) return;

      const brandName = item.medicine.brand || "Generics";
      const pharData = nearbyPharmacies.find(p => p._id.toString() === item.pharmacy._id.toString());

      if (!grouped[brandName]) {
        grouped[brandName] = { brand: brandName, options: [] };
      }

      grouped[brandName].options.push({
        medicineName: item.medicine.name,
        pharmacy: item.pharmacy.storeName || item.pharmacy.name,
        pharmacyId: item.pharmacy._id,
        price: item.price,
        stock: item.stock,
        salt: item.medicine.salt,
        category: item.medicine.category,
        image: item.medicine.image || "https://cdn-icons-png.flaticon.com/512/883/883356.png",
        distance: pharData ? parseFloat(pharData.distance.toFixed(1)) : 0
      });
    });

    res.json({ success: true, count: Object.keys(grouped).length, results: Object.values(grouped) });

  } catch (error) {
    console.error("❌ Aggregation Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};