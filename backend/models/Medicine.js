const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    brand: { type: String, trim: true },
    salt: { 
        type: String, 
        required: function() { return ['Prescription', 'OTC'].includes(this.category); } 
    },
    category: {
        type: String,
        required: true,
        enum: ['Prescription', 'OTC', 'Devices', 'Baby Care', 'Personal Care', 'Supplements', 'Ayurvedic', 'First Aid']
    },
    price: { type: Number, default: 0 },
    image: { 
        type: String, 
        default: 'https://placehold.jp/24/1e293b/ffffff/300x300.png?text=Medicine_Asset' 
    },
    prescription_required: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Medicine', medicineSchema);