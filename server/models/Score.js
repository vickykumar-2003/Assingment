const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    coursePar: { type: Number, required: true },
    strokes: { type: Number, required: true },
    stablefordPoints: { type: Number, required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Score', scoreSchema);
