const mongoose = require('mongoose');

const charitySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    image: { type: String, required: true }, // Image URL
    website: { type: String },
    minContribution: { type: Number, default: 10 },
    totalRaised: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Charity', charitySchema);
