const Pharmacy = require('../models/Pharmacy');

exports.requireVerifiedPharmacy = async (req, res, next) => {
  try {
    const pharmacy = await Pharmacy.findOne({ owner: req.user._id });

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: 'Pharmacy not found'
      });
    }

    if (!pharmacy.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Pharmacy not verified by admin'
      });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
