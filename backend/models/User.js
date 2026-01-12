const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    phone: {
      type: String,
      required: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ['patient', 'pharmacy', 'lab', 'doctor', 'admin'],
      default: 'patient'
    },

    address: {
      city: String,
      state: String,
      pincode: String
    },

    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0]
      }
    },

    isVerified: {
      type: Boolean,
      default: false // pharmacy, lab, doctor ke liye admin verify karega
    }
  },
  { timestamps: true }
);

// 📍 Geospatial index (nearest store search ke liye)
userSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', userSchema);
