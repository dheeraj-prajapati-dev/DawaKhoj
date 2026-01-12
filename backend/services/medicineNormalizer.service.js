const medicineMaster = require('../utils/medicineMaster');

exports.normalizeMedicines = (text) => {
  const lowerText = text.toLowerCase();

  const found = [];

  medicineMaster.forEach(med => {
    if (lowerText.includes(med.brand)) {
      found.push({
        brand: med.brand,
        salt: med.salt
      });
    }
  });

  return found;
};
