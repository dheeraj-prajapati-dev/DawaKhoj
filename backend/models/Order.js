const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true // 🔥 Speed up user order history queries
  },
  pharmacy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Pharmacy', 
    required: true,
    index: true // 🔥 Speed up pharmacy dashboard queries
  },
  medicineName: { 
    type: String, 
    required: true,
    trim: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Accepted', 'Rejected', 'Out for Delivery', 'Delivered'], 
    default: 'Pending' 
  },
  // ⭐ Rating Fields
  isRated: { 
    type: Boolean, 
    default: false 
  },
  rating: { 
    type: Number, 
    default: 0, 
    min: 0, 
    max: 5 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true // Ye automatically 'updatedAt' bhi manage karega
});

module.exports = mongoose.model('Order', orderSchema);