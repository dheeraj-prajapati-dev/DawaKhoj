const express = require('express');
const router = express.Router();
const { parseMedicines } = require("../utils/medicineParser");

const medicines = parseMedicines(extractedText);

console.log("🧠 Parsed Medicines:", medicines);



const flowController = require('../controllers/flow.controller');
const upload = require('../middleware/upload.middleware');

router.post(
  '/prescription-search',
  upload.single('image'),
  flowController.prescriptionToPharmacy
);

module.exports = router;
