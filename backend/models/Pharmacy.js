const mongoose = require('mongoose');

const pharmacySchema = new mongoose.Schema(
  {
    // Store basic info
    storeName: {
      type: String,
      required: true,
      trim: true
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    phone: {
      type: String,
      required: true
    },

    address: {
      street: String,
      city: String,
      state: String,
      pincode: String
    },

    // 📍 Location for nearest store search
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
        required: true
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },

    // Admin verification
    isVerified: {
      type: Boolean,
      default: false
    },

    // Extra flags (future use)
    homeDelivery: {
      type: Boolean,
      default: false
    },

    open24x7: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// 🔥 Geo index (VERY IMPORTANT)
pharmacySchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Pharmacy', pharmacySchema);
