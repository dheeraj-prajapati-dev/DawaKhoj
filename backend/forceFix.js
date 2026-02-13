const mongoose = require('mongoose');
require('dotenv').config();
const Medicine = require('./models/Medicine'); 

const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/dawakhoj"; 

const forceFix = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("🚀 Connected to DB...");

    // 1. Sabse pehle check karo "Dolo" kis category mein hai
    const doloCheck = await Medicine.findOne({ name: /dolo/i });
    console.log(`🔍 Current Dolo Category in DB: "${doloCheck?.category}"`);

    // 2. FORCE RESET: Saari medicines ko unki sahi category mein daalo
    // Hum "Dolo" ko Baby Care se nikaal kar Prescription mein daal rahe hain
    const res = await Medicine.updateMany(
      { 
        name: { $regex: /dolo|paracetamol|crocin|calpol/i },
        category: "Baby Care" // Sirf unhe pakdo jo galti se Baby Care mein hain
      }, 
      { $set: { category: "Prescription" } }
    );

    console.log(`✅ Fixed ${res.modifiedCount} items that were stuck in Baby Care.`);

    // 3. Agar modifiedCount 0 hai, toh iska matlab DB mein category ka naam 
    // "Baby Care" nahi balki kuch aur ho sakta hai (jaise "babycare" ya "BabyCare")
    if (res.modifiedCount === 0) {
      console.log("⚠️ No items updated. Trying case-insensitive category fix...");
      const res2 = await Medicine.updateMany(
        { name: /dolo/i },
        { $set: { category: "Prescription" } }
      );
      console.log(`✅ Hard Reset: Updated ${res2.modifiedCount} items to Prescription.`);
    }

  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    mongoose.connection.close();
    process.exit();
  }
};

forceFix();