const Pharmacy = require('../models/Pharmacy');
const Inventory = require('../models/Inventory');
const Medicine = require('../models/Medicine');

exports.findNearestPharmacies = async (req, res) => {
  try {
    const { lat, lng, q } = req.query;

    if (!lat || !lng || !q) {
      return res.status(400).json({ message: 'lat, lng and medicine query required' });
    }

    // Find medicine
    const medicine = await Medicine.findOne({
      $or: [
        { name: new RegExp(q, 'i') },
        { salt: new RegExp(q, 'i') }
      ]
    });

    if (!medicine) return res.json([]);

    // Find nearby pharmacies (5km)
    const pharmacies = await Pharmacy.find({
      isVerified: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [Number(lng), Number(lat)]
          },
          $maxDistance: 5000 // meters
        }
      }
    });

    const results = [];

    for (let pharmacy of pharmacies) {
      const inventory = await Inventory.findOne({
        pharmacy: pharmacy._id,
        medicine: medicine._id,
        stock: { $gt: 0 }
      });

      if (inventory) {
        results.push({
          pharmacy: pharmacy.storeName,
          price: inventory.price,
          stock: inventory.stock,
          location: pharmacy.location
        });
      }
    }

    res.json({
      medicine: medicine.name,
      results
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
