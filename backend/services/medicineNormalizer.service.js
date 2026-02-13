const medicineMaster = require('../utils/medicineMaster');

/**
 * Normalize Medicines: OCR text se dawaiyon ke naam nikaalta hai 
 * aur unhe master list se match karke brand aur salt provide karta hai.
 */
exports.normalizeMedicines = (text) => {
  if (!text) return [];

  // 1. Text ko clean karein (Extra spaces aur special characters hatayein)
  const cleanedText = text.replace(/[^a-zA-Z0-9\s]/g, ' ').toLowerCase();
  const found = [];
  const seenBrands = new Set();

  // 2. Medicine Master se match karein
  medicineMaster.forEach(med => {
    const brandLower = med.brand.toLowerCase();
    
    // Exact Word Match ke liye Regex use karein 
    // (Taaki 'Dolo' sirf 'Dolo' se match ho, 'Dolonex' se nahi agar hum na chahein)
    const regex = new RegExp(`\\b${brandLower}\\b`, 'i');

    if (regex.test(cleanedText) && !seenBrands.has(brandLower)) {
      found.push({
        brand: med.brand, // Original casing (Dolo 650)
        salt: med.salt      // Price comparison aur alternatives ke liye zaroori [cite: 5, 6]
      });
      seenBrands.add(brandLower);
    }
  });

  // 3. Roadmap Feature: Agar brand nahi mila toh salt matching ka fallback (Optional but Recommended)
  if (found.length === 0) {
    medicineMaster.forEach(med => {
        const saltLower = med.salt.toLowerCase();
        if (cleanedText.includes(saltLower) && !seenBrands.has(med.brand.toLowerCase())) {
            found.push({
                brand: med.brand,
                salt: med.salt,
                note: "Matched via salt component" 
            });
            seenBrands.add(med.brand.toLowerCase());
        }
    });
  }

  console.log(`🧪 OCR Match Result: ${found.length} medicines detected.`);
  return found;
};