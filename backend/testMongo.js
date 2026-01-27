require('dotenv').config();   // 🔥 THIS LINE WAS MISSING

const mongoose = require('mongoose');

console.log('MONGO_URI =', process.env.MONGO_URI); // DEBUG

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Mongo connected ✅'))
  .catch(err => console.error('Mongo error ❌', err));
