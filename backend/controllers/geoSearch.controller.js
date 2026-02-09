const Pharmacy = require('../models/Pharmacy');
const Inventory = require('../models/Inventory');
const Medicine = require('../models/Medicine');

exports.findNearestPharmacies = async (req, res) => {
  try {
    const { lat, lng, q } = req.query;

    if (!lat || !lng || !q) {
      return res.status(400).json({ success: false, message: 'Missing params (lat, lng, or q)' });
    }

    // 1. Medicine Search (Name ya Salt)
    const medicine = await Medicine.findOne({
      $or: [
        { name: new RegExp(q, 'i') },
        { salt: new RegExp(q, 'i') }
      ]
    });

    if (!medicine) {
      return res.json({ success: true, results: [] });
    }

    // 2. COORDINATES FIX: Strict Longitude, Latitude order
    const userLongitude = parseFloat(lng);
    const userLatitude = parseFloat(lat);

    console.log(`📡 DB Query -> Lng: ${userLongitude}, Lat: ${userLatitude}`);

    // 3. Geospatial Aggregation (Finding nearby verified pharmacies)
    const nearbyPharmacies = await Pharmacy.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [userLongitude, userLatitude]
          },
          distanceField: "distance",
          spherical: true,
          maxDistance: 50000, // 50km
          distanceMultiplier: 0.001, // Meters to KM
          query: { isVerified: true }
        }
      }
    ]);

    if (!nearbyPharmacies.length) {
      return res.json({ success: true, results: [] });
    }

    // 4. Inventory Matching (Optimized with Promise.all)
    const options = await Promise.all(
      nearbyPharmacies.map(async (pharmacy) => {
        const inventory = await Inventory.findOne({
          pharmacy: pharmacy._id,
          medicine: medicine._id,
          stock: { $gt: 0 }
        });

        if (inventory) {
          return {
            medicineName: medicine.name,
            pharmacy: pharmacy.storeName,
            pharmacyId: pharmacy._id,
            price: inventory.price,
            stock: inventory.stock,
            // NaN safety check and formatting
            distance: (pharmacy.distance !== undefined && !isNaN(pharmacy.distance)) 
              ? parseFloat(pharmacy.distance.toFixed(1)) 
              : 0,
            location: pharmacy.location
          };
        }
        return null;
      })
    );

    // Filter out nulls (where medicine wasn't in stock)
    const filteredOptions = options.filter(opt => opt !== null);

    // 5. Final Response Structure
    res.json({
      success: true,
      results: [{
        brand: medicine.brand || "Generics",
        options: filteredOptions
      }]
    });

  } catch (error) {
    console.error("❌ Aggregation Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error", 
      error: error.message 
    });
  }
};