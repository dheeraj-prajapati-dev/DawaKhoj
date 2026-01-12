const express = require('express');
const router = express.Router();

const { findNearestPharmacies } = require('../controllers/geoSearch.controller');

router.get('/nearest', findNearestPharmacies);

module.exports = router;
