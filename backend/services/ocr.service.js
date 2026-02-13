const vision = require('@google-cloud/vision');
const path = require('path');
const fs = require('fs');

// Path check for production and local
const keyPath = path.join(__dirname, '../../', process.env.GOOGLE_APPLICATION_CREDENTIALS || 'google-vision-key.json');

const client = new vision.ImageAnnotatorClient({
  keyFilename: keyPath
});

exports.extractTextFromImage = async (imagePath) => {
  try {
    console.log('🧠 Vision OCR starting...');
    
    if (!fs.existsSync(imagePath)) {
      console.error('❌ File not found at:', imagePath);
      return "Error: Image file not found.";
    }

    const [result] = await client.textDetection(imagePath);
    const detections = result.textAnnotations;

    if (!detections || detections.length === 0) {
      return "No text detected. Please search manually.";
    }

    console.log('✅ OCR Successful');
    return detections[0].description;

  } catch (error) {
    console.error('❌ Vision API Error:', error.message);
    // Fallback message taaki server crash na ho (Screenshot 631)
    return "AI could not process the image at this moment.";
  }
};