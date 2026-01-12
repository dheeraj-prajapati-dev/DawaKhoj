const express = require('express');
const router = express.Router();

const { searchMedicinePrices } = require('../controllers/search.controller');

// 🔍 Price comparison search
router.get('/medicine', searchMedicinePrices);

module.exports = router;
