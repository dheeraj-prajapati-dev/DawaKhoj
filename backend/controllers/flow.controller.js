const { extractTextFromImage } = require('../services/ocr.service');
const { normalizeMedicines } = require('../services/medicineNormalizer.service');
const cloudinary = require('../config/cloudinary');
const Inventory = require('../models/Inventory');
const Pharmacy = require('../models/Pharmacy');
const Medicine = require('../models/Medicine'); 

exports.prescriptionToPharmacy = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    if (!req.file || !lat || !lng) {
      return res.status(400).json({ success: false, message: 'image, lat and lng are required' });
    }

    // 1️⃣ Upload to cloudinary
    const uploadRes = await cloudinary.uploader.upload(req.file.path, { folder: 'prescriptions' });

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

    // 4️⃣ Find nearby pharmacies (20km range)
    const nearbyPharmacies = await Pharmacy.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
          $maxDistance: 20000
        }
      }
    }).select('_id storeName phone homeDelivery open24x7 location');

    const pharmacyIds = nearbyPharmacies.map(p => p._id);
    const results = [];

    // 5️⃣ Loop medicines - UPDATED FUZZY LOGIC
    for (const med of detectedMedicines) {
      console.log(`🧪 Searching for Brand: ${med.brand}`);

      // STEP A: Priority Search - Partial Brand Match 
      // (Isse "Dolo" likhne par "Dolo 650" bhi mil jayega)
      let matchedMedicines = await Medicine.find({
        name: new RegExp(med.brand, 'i') 
      });

      // STEP B: Agar brand se kuch nahi mila, tabhi Salt search karo
      if (matchedMedicines.length === 0) {
        matchedMedicines = await Medicine.find({
          salt: new RegExp(med.salt, 'i')
        });
      }

      const medicineIds = matchedMedicines.map(m => m._id);

      // STEP C: Inventory fetch (Only nearby, in-stock, and matched IDs)
      const inventories = await Inventory.find({
        pharmacy: { $in: pharmacyIds },
        medicine: { $in: medicineIds },
        stock: { $gt: 0 }
      })
      .populate('medicine')
      .populate({
        path: 'pharmacy',
        select: 'storeName phone homeDelivery open24x7 location'
      })
      .sort({ price: 1 });

      // STEP D: Map results to options
      const options = inventories
        .filter(i => i.medicine && i.pharmacy)
        .map(i => ({
          pharmacyId: i.pharmacy._id,
          pharmacy: i.pharmacy.storeName,
          phone: i.pharmacy.phone,
          price: i.price,
          stock: i.stock,
          homeDelivery: i.pharmacy.homeDelivery,
          medicineName: i.medicine.name,
          salt: i.medicine.salt
        }));

      results.push({
        requestedMedicine: med,
        options: options
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
    return res.status(500).json({ success: false, message: 'Prescription flow failed' });
  }
};