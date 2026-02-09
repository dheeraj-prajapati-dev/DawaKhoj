const express = require('express');
const router = express.Router();

const { findNearestPharmacies } = require('../controllers/geoSearch.controller');

// 🔍 Price comparison search
router.get('/medicine', findNearestPharmacies);

module.exports = router;
