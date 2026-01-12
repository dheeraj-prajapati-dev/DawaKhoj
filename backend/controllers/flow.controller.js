const { extractTextFromImage } = require('../services/ocr.service');
const { normalizeMedicines } = require('../services/medicineNormalizer.service');
const cloudinary = require('../config/cloudinary');
const Inventory = require('../models/Inventory');
const Pharmacy = require('../models/Pharmacy');

exports.prescriptionToPharmacy = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    if (!req.file || !lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'image, lat and lng are required'
      });
    }

    // 1️⃣ Upload
    const uploadRes = await cloudinary.uploader.upload(req.file.path, {
      folder: 'prescriptions'
    });

    // 2️⃣ OCR
    const extractedText = await extractTextFromImage(req.file.path);

    // 3️⃣ Detect medicines
    const detectedMedicines = normalizeMedicines(extractedText);

    if (!detectedMedicines.length) {
      return res.json({
        success: true,
        imageUrl: uploadRes.secure_url,
        extractedText,
        results: []
      });
    }

    const results = [];

    for (const med of detectedMedicines) {

      // ✅ Step A: find pharmacies nearby FIRST
      const nearbyPharmacies = await Pharmacy.find({
        isVerified: true,
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [Number(lng), Number(lat)]
            },
            $maxDistance: 5000
          }
        }
      }).select('_id storeName address phone homeDelivery open24x7 location');

      if (!nearbyPharmacies.length) {
        results.push({ requestedMedicine: med, options: [] });
        continue;
      }

      const pharmacyIds = nearbyPharmacies.map(p => p._id);

      // ✅ Step B: inventory lookup
      const inventories = await Inventory.find({
        stock: { $gt: 0 },
        pharmacy: { $in: pharmacyIds }
      })
        .populate({
          path: 'medicine',
          match: {
            $or: [
              { name: new RegExp(med, 'i') },
              { salt: new RegExp(med, 'i') }
            ]
          }
        })
        .populate({
          path: 'pharmacy',
          select: 'storeName address phone homeDelivery open24x7 location'
        })
        .sort({ price: 1 });

      const options = inventories
        .filter(i => i.medicine && i.pharmacy)
        .map(i => ({
          pharmacy: i.pharmacy.storeName,
          phone: i.pharmacy.phone,
          price: i.price,
          stock: i.stock,
          homeDelivery: i.pharmacy.homeDelivery,
          distance: Math.round(
            (i.pharmacy.location.coordinates
              ? 0 // optional calc later
              : 0)
          )
        }));

      results.push({
        requestedMedicine: med,
        options
      });
    }

    return res.json({
      success: true,
      imageUrl: uploadRes.secure_url,
      extractedText,
      results
    });

  } catch (err) {
    console.error('❌ Prescription flow error:', err);
    res.status(500).json({
      success: false,
      message: 'Prescription flow failed'
    });
  }
};
