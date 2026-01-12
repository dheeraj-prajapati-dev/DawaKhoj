const Tesseract = require('tesseract.js');

exports.extractTextFromImage = async (imagePath) => {
  try {
    console.log('🧠 Tesseract OCR started on:', imagePath);

    const result = await Tesseract.recognize(
      imagePath,
      'eng',
      {
        logger: m => console.log(m.status)
      }
    );

    console.log('✅ OCR completed');
    return result.data.text;

  } catch (error) {
    console.error('❌ Tesseract OCR Error:', error);
    throw new Error('OCR failed');
  }
};
