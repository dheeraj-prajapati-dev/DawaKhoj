const Pharmacy = require('../models/Pharmacy');

// 🏥 REGISTER PHARMACY
exports.registerPharmacy = async (req, res) => {
  try {
    const {
      storeName,
      phone,
      address,
      longitude,
      latitude,
      homeDelivery,
      open24x7
    } = req.body;

    // Check role
    if (req.user.role !== 'pharmacy') {
      return res.status(403).json({
        message: 'Only pharmacy users can register a medical store'
      });
    }

    // Check already registered
    const existingPharmacy = await Pharmacy.findOne({ owner: req.user._id });
    if (existingPharmacy) {
      return res.status(400).json({
        message: 'Pharmacy already registered for this user'
      });
    }

    const pharmacy = await Pharmacy.create({
      storeName,
      owner: req.user._id,
      phone,
      address,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      homeDelivery,
      open24x7
    });

    res.status(201).json({
      message: 'Pharmacy registered successfully. Waiting for admin approval.',
      pharmacy
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 👑 ADMIN: APPROVE PHARMACY
exports.approvePharmacy = async (req, res) => {
  try {
    const { pharmacyId } = req.params;

    const pharmacy = await Pharmacy.findById(pharmacyId);
    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy not found' });
    }

    pharmacy.isVerified = true;
    await pharmacy.save();

    res.json({
      message: 'Pharmacy approved successfully',
      pharmacy
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🌍 PUBLIC: GET ALL VERIFIED PHARMACIES
exports.getVerifiedPharmacies = async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find({ isVerified: true })
      .populate('owner', 'name phone')
      .sort({ createdAt: -1 });

    res.json({
      count: pharmacies.length,
      pharmacies
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 📍 GET NEAREST VERIFIED PHARMACIES
exports.getNearestPharmacies = async (req, res) => {
  try {
    const { latitude, longitude, distance } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        message: 'Latitude and longitude are required'
      });
    }

    // distance in KM (default 5km)
    const maxDistance = (distance || 5) * 1000;

    const pharmacies = await Pharmacy.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          distanceField: 'distance',
          maxDistance: maxDistance,
          spherical: true,
          query: { isVerified: true }
        }
      },
      {
        $project: {
          storeName: 1,
          phone: 1,
          address: 1,
          distance: { $round: ['$distance', 0] },
          homeDelivery: 1,
          open24x7: 1
        }
      }
    ]);

    res.json({
      count: pharmacies.length,
      pharmacies
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getMyProfile = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findOne({ owner: req.user._id });

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: 'Pharmacy not found'
      });
    }

    res.json({
      success: true,
      pharmacy,
      isVerified: pharmacy.isVerified
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 👑 ADMIN: GET UNVERIFIED PHARMACIES
exports.getUnverifiedPharmacies = async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find({ isVerified: false })
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: pharmacies.length,
      pharmacies
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};







