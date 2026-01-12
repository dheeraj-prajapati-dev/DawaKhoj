const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    salt: {
      type: String,
      required: true
    },

    category: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Medicine', medicineSchema);
