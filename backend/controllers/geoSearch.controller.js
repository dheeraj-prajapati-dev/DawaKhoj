const Pharmacy = require('../models/Pharmacy');
const Inventory = require('../models/Inventory');
const Medicine = require('../models/Medicine');

exports.findNearestPharmacies = async (req, res) => {
  try {
    const { lat, lng, q, category } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: 'Location required' });
    }

    let andConditions = [];

    if (category && category !== 'All') {
      // Regex for case-insensitive and trim handling
      andConditions.push({ category: { $regex: new RegExp(`^${category.trim()}$`, 'i') } });
    }

    if (q && q.trim().length > 0) {
      andConditions.push({
        $or: [
          { name: { $regex: q.trim(), $options: 'i' } },
          { salt: { $regex: q.trim(), $options: 'i' } }
        ]
      });
    }

    let medicineCriteria = andConditions.length > 0 ? { $and: andConditions } : {};

    const matchedMedicines = await Medicine.find(medicineCriteria);
    if (!matchedMedicines.length) return res.json({ success: true, results: [] });

    const medicineIds = matchedMedicines.map(m => m._id);

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

    const inventoryItems = await Inventory.find({
      pharmacy: { $in: pharmacyIds },
      medicine: { $in: medicineIds },
      stock: { $gt: 0 }
    }).populate('medicine pharmacy');

    const grouped = {};
    inventoryItems.forEach(item => {
      if (!item.medicine) return; // Safety check
      
      const brandName = item.medicine.brand || "Generics";
      const pharData = nearbyPharmacies.find(p => p._id.toString() === item.pharmacy._id.toString());

      if (!grouped[brandName]) {
        grouped[brandName] = { brand: brandName, options: [] };
      }

      grouped[brandName].options.push({
        _id: item.medicine._id, // 🔥 CRITICAL: Navigation ke liye asli medicine ID
        medicineId: item.medicine._id,
        medicineName: item.medicine.name,
        pharmacy: item.pharmacy?.storeName || item.pharmacy?.name,
        pharmacyId: item.pharmacy?._id,
        price: item.price,
        stock: item.stock,
        salt: item.medicine.salt,
        category: item.medicine.category,
        image: item.medicine.image || "https://cdn-icons-png.flaticon.com/512/883/883356.png",
        distance: pharData ? parseFloat(pharData.distance.toFixed(1)) : 0
      });
    });

    res.json({ success: true, results: Object.values(grouped) });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};