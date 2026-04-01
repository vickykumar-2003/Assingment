const mongoose = require('mongoose');

const drawSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    winningNumbers: { 
        type: [Number], 
        required: true,
        validate: [v => v.length === 5, 'Winning numbers must be 5']
    },
    totalPrizePool: { type: Number, required: true },
    published: { type: Boolean, default: false },
    jackpotRollover: { type: Number, default: 0 },
    stats: {
        fiveMatchCount: { type: Number, default: 0 },
        fourMatchCount: { type: Number, default: 0 },
        threeMatchCount: { type: Number, default: 0 }
    }
});

module.exports = mongoose.model('Draw', drawSchema);
