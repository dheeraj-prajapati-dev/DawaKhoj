const { extractTextFromImage } = require('../services/ocr.service');
const { normalizeMedicines } = require('../services/medicineNormalizer.service');
const cloudinary = require('../config/cloudinary');

exports.uploadPrescription = async (req, res) => {
  try {
    // 1️⃣ Check image
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    // 2️⃣ Upload image to Cloudinary
    const uploadRes = await cloudinary.uploader.upload(req.file.path, {
      folder: 'prescriptions'
    });

    // 3️⃣ OCR from local file
    const extractedText = await extractTextFromImage(req.file.path);

    // 4️⃣ Normalize medicines (IMPORTANT STEP)
    const normalizedMedicines = normalizeMedicines(extractedText);

    // 5️⃣ ✅ YAHI PE RESPONSE JATA HAI (ANSWER TO YOUR QUESTION)
    res.status(200).json({
      success: true,
      imageUrl: uploadRes.secure_url,
      extractedText,
      medicines: normalizedMedicines
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to extract text from image'
    });
  }
};
