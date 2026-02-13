const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const {
    addOrUpdateInventory,
    getMyInventory,
    updateInventory,
    deleteInventory,
    bulkUploadInventory // Naya function
} = require('../controllers/inventory.controller');

const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

// Multer setup: 'uploads' folder check and file filter
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const upload = multer({ 
    dest: uploadDir,
    fileFilter: (req, file, cb) => {
        const filetypes = /csv/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) return cb(null, true);
        cb(new Error('Sirf CSV files allow hain!'));
    }
});

// ✅ BULK UPLOAD (Thousands of items)
router.post(
    '/bulk-upload',
    protect,
    authorizeRoles('pharmacy'),
    upload.single('file'), 
    bulkUploadInventory
);

// ✅ SINGLE ADD / UPDATE
router.post('/add', protect, authorizeRoles('pharmacy'), addOrUpdateInventory);

// ✅ GET INVENTORY
router.get('/my', protect, authorizeRoles('pharmacy'), getMyInventory);

// ✅ UPDATE & DELETE
router.put('/update/:id', protect, authorizeRoles('pharmacy'), updateInventory);
router.delete('/delete/:id', protect, authorizeRoles('pharmacy'), deleteInventory);

module.exports = router;