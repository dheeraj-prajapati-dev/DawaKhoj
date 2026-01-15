const express = require('express');
const router = express.Router();

const upload = require('../middlewares/upload.middleware');
const { prescriptionToPharmacy } = require('../controllers/flow.controller');

// ✅ ONLY route definition
router.post(
  '/prescription-search',
  upload.single('image'),
  prescriptionToPharmacy
);

module.exports = router;
