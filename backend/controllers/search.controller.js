const Inventory = require('../models/Inventory');
const Medicine = require('../models/Medicine');

exports.searchMedicinePrices = async (req, res) => {
  try {
    const { q, lat, lng } = req.query;

    if (!q || !lat || !lng) {
      return res.status(400).json({
        message: 'q, lat and lng are required'
      });
    }

    // 1️⃣ Medicine find
    const medicine = await Medicine.findOne({
      $or: [
        { name: new RegExp(q, 'i') },
        { salt: new RegExp(q, 'i') }
      ]
    });

    if (!medicine) {
      return res.json({
        medicine: q,
        results: []
      });
    }

    // 2️⃣ Inventory + nearest pharmacy
    const inventories = await Inventory.find({
      medicine: medicine._id,
      stock: { $gt: 0 }
    })
      .populate({
        path: 'pharmacy',
        match: {
          isVerified: true,
          location: {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [
                  parseFloat(lng),
                  parseFloat(lat)
                ]
              },
              $maxDistance: 5000 // 5km
            }
          }
        },
        select: 'storeName address location'
      })
      .sort({ price: 1 });

    // 3️⃣ remove null pharmacies
    const result = inventories.filter(i => i.pharmacy);

    res.status(200).json({
      medicine: medicine.name,
      salt: medicine.salt,
      count: result.length,
      results: result
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
