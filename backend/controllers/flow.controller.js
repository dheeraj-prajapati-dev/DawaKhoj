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

    // 1️⃣ Upload to cloudinary
    const uploadRes = await cloudinary.uploader.upload(req.file.path, {
      folder: 'prescriptions'
    });

    // 2️⃣ OCR
    const extractedText = await extractTextFromImage(req.file.path);

    // 3️⃣ Detect medicines
    const detectedMedicines = normalizeMedicines(extractedText);
    console.log('🧪 detectedMedicines:', detectedMedicines);

    if (!detectedMedicines.length) {
      return res.json({
        success: true,
        imageUrl: uploadRes.secure_url,
        extractedText,
        results: []
      });
    }

    // 4️⃣ Find nearby pharmacies
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
    }).select('_id storeName phone homeDelivery open24x7 location');

    if (!nearbyPharmacies.length) {
      return res.json({
        success: true,
        imageUrl: uploadRes.secure_url,
        extractedText,
        results: detectedMedicines.map(m => ({
          requestedMedicine: m,
          options: []
        }))
      });
    }

    const pharmacyIds = nearbyPharmacies.map(p => p._id);
    const results = [];

    // 5️⃣ Loop medicines
    for (const med of detectedMedicines) {
      console.log('🧪 checking medicine:', med);

      const inventories = await Inventory.find({
        pharmacy: { $in: pharmacyIds },
        stock: { $gt: 0 }
      })
        .populate({
          path: 'medicine',
          match: {
            // 🔥 ONLY SALT MATCH (FINAL FIX)
            salt: new RegExp(med.salt, 'i')
          }
        })
        .populate({
          path: 'pharmacy',
          select: 'storeName phone homeDelivery open24x7 location'
        })
        .sort({ price: 1 });

      console.log('🧪 inventories length:', inventories.length);

      const options = inventories
        .filter(i => i.medicine && i.pharmacy)
        .map(i => ({
          pharmacy: i.pharmacy.storeName,
          phone: i.pharmacy.phone,
          price: i.price,
          stock: i.stock,
          homeDelivery: i.pharmacy.homeDelivery
        }));

      results.push({
        requestedMedicine: med,
        options
      });
    }

    console.log('🧪 FINAL RESULTS:', results);

    return res.json({
      success: true,
      imageUrl: uploadRes.secure_url,
      extractedText,
      results
    });

  } catch (err) {
    console.error('❌ Prescription flow error:', err);
    return res.status(500).json({
      success: false,
      message: 'Prescription flow failed'
    });
  }
};
