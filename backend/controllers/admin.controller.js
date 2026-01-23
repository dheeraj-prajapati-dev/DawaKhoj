const Pharmacy = require('../models/Pharmacy');

// ✅ GET ALL PHARMACIES (pending + approved)
exports.getAllPharmacies = async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find()
      .populate('owner', 'email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      pharmacies
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ APPROVE PHARMACY
exports.approvePharmacy = async (req, res) => {
  try {
    const { id } = req.params;

    const pharmacy = await Pharmacy.findById(id);
    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy not found' });
    }

    pharmacy.isVerified = true;
    await pharmacy.save();

    res.json({
      success: true,
      message: 'Pharmacy approved'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
