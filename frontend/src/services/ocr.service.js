const vision = require('@google-cloud/vision');

// Creating client using the key from your .env path
const client = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS 
});

exports.extractTextFromImage = async (filePath) => {
  try {
    const [result] = await client.textDetection(filePath);
    const detections = result.textAnnotations;
    if (!detections || detections.length === 0) return "";
    return detections[0].description;
  } catch (error) {
    console.error("❌ Google Vision Error:", error.message);
    throw new Error("OCR Service Failed: Check your json key file path");
  }
};