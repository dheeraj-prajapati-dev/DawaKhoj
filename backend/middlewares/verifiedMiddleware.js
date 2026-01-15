module.exports.requireVerifiedPharmacy = (req, res, next) => {
  if (!req.user.isVerified) {
    return res.status(403).json({
      success: false,
      message: 'Pharmacy is not verified yet'
    });
  }
  next();
};
