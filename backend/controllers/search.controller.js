const Medicine = require('../models/Medicine');
const Inventory = require('../models/Inventory');
const Pharmacy = require('../models/Pharmacy');

// Simple Haversine Formula distance calculate karne ke liye (KM mein)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return (R * c).toFixed(1); // 1 decimal tak distance
};

exports.searchMedicinePrices = async (req, res) => {
  try {
    const { q, lat, lng } = req.query; // Frontend se aane wale coordinates
    console.log(`🔍 Search for: ${q} | User Loc: ${lat}, ${lng}`);

    // 1. Medicine dhoondo (Name ya Salt se)
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
    .populate({
      path: 'pharmacy',
      select: 'storeName location address phone' // Location zaroori hai distance ke liye
    })
    .sort({ price: 1 }); // Default sorting: Sasta sabse upar

    // 3. Format & Group results with Distance
    const finalResults = medicines.map(med => {
      const options = inventories
        .filter(inv => inv.pharmacy && inv.medicine._id.toString() === med._id.toString())
        .map(inv => {
          let distance = null;
          
          // Agar user coordinates hain aur pharmacy ke coordinates bhi hain
          if (lat && lng && inv.pharmacy.location?.coordinates) {
            const [pLng, pLat] = inv.pharmacy.location.coordinates;
            distance = calculateDistance(parseFloat(lat), parseFloat(lng), pLat, pLng);
          }

          return {
            pharmacyId: inv.pharmacy._id,
            pharmacy: inv.pharmacy.storeName,
            medicineName: inv.medicine.name,
            salt: inv.medicine.salt,
            price: inv.price,
            stock: inv.stock,
            distance: distance ? `${distance} km` : "Location N/A"
          };
        });

      // Confirm sorting by price
      options.sort((a, b) => a.price - b.price);

      return options.length > 0 ? { brand: med.name, options } : null;
    }).filter(g => g !== null);

    // ====== SOCKET NOTIFICATION LOGIC ======
    const io = req.app.get('socketio');
    if (io && finalResults.length > 0) {
      io.emit('search_alert', {
        message: `🔍 Kisi ne "${q}" dawa search ki hai!`,
        timestamp: new Date()
      });
    }

    res.status(200).json({ success: true, results: finalResults });
  } catch (err) {
    console.error("❌ Search Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};