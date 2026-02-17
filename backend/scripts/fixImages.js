const mongoose = require('mongoose');
const Medicine = require('../models/Medicine');
require('dotenv').config();

const NEW_PLACEHOLDER = 'https://placehold.jp/24/1e293b/ffffff/300x300.png?text=Medicine_Asset';

const fixDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("🛠️ Connected. Recalibrating image assets...");

        const result = await Medicine.updateMany(
            {
                $or: [
                    { image: { $regex: 'google.com/search', $options: 'i' } },
                    { image: { $regex: 'via.placeholder.com', $options: 'i' } },
                    { image: { $regex: 'placehold.co', $options: 'i' } },
                    { image: "" },
                    { image: null }
                ]
            },
            { $set: { image: NEW_PLACEHOLDER } }
        );

        console.log(`✅ Success! Updated ${result.modifiedCount} medicines.`);
        process.exit();
    } catch (err) {
        console.error("❌ Mission Failed:", err);
        process.exit(1);
    }
};

fixDatabase();