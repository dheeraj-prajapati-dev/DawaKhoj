const Pharmacy = require('../models/pharmacy.model');
const Inventory = require('../models/inventory.model');

exports.searchNearestPharmacies = async (
  medicine,
  longitude,
  latitude
) => {
  // 1️⃣ Find nearby verified pharmacies (within 5km)
  const pharmacies = await Pharmacy.find({
    isVerified: true,
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: 5000 // meters
      }
    }
  });

  // 2️⃣ Get inventory + price for each pharmacy
  const results = [];

  for (let pharmacy of pharmacies) {
    const item = await Inventory.findOne({
      pharmacy: pharmacy._id,
      $or: [
        { medicineName: new RegExp(medicine, 'i') },
        { salt: new RegExp(medicine, 'i') }
      ]
    });

    if (item) {
      results.push({
        pharmacy: pharmacy.name,
        price: item.price,
        stock: item.stock,
        pharmacyId: pharmacy._id
      });
    }
  }

  // 3️⃣ Price sort (cheap first)
  return results.sort((a, b) => a.price - b.price);
};
