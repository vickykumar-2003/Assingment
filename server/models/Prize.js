const mongoose = require('mongoose');

const prizeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    drawId: { type: mongoose.Schema.Types.ObjectId, ref: 'Draw', required: true },
    matchCategory: { type: String, enum: ['5-match', '4-match', '3-match'], required: true },
    prizeAmount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Verified', 'Paid', 'Rejected'], default: 'Pending' },
    proofScreenshot: { type: String }, // URL or path
    verifiedAt: { type: Date },
    paidAt: { type: Date },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prize', prizeSchema);
