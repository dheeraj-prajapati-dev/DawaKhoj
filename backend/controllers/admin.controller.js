const Pharmacy = require('../models/Pharmacy');

exports.getAllPharmacies = async (req, res) => {
  const pharmacies = await Pharmacy.find()
    .populate('owner', 'email');

  res.json({ pharmacies });
};

exports.approvePharmacy = async (req, res) => {
  const pharmacy = await Pharmacy.findById(req.params.id);

  if (!pharmacy) {
    return res.status(404).json({ message: 'Pharmacy not found' });
  }

  pharmacy.isVerified = true;
  await pharmacy.save();

  res.json({ success: true });
};
