const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { checkSubscription } = require('../middleware/subscription');
const User = require('../models/User');
const Score = require('../models/Score');
const Draw = require('../models/Draw');
const Prize = require('../models/Prize');

// Get Profile & Subscription Status
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('currentCharity');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update Scores - Stableford Logic
router.post('/scores', auth, checkSubscription, async (req, res) => {
    try {
        const { par, strokes } = req.body;
        if (!par || !strokes) {
            return res.status(400).json({ message: 'Par and strokes are required' });
        }

        const diff = strokes - par;
        let points = 0;
        if (diff <= -2) points = 4;      // Eagle or better
        else if (diff === -1) points = 3; // Birdie
        else if (diff === 0) points = 2;  // Par
        else if (diff === 1) points = 1;  // Bogey
        else points = 0;                  // Double bogey or worse

        const newScoreObj = new Score({
            userId: req.user.id,
            coursePar: par,
            strokes,
            stablefordPoints: points
        });
        await newScoreObj.save();

        const user = await User.findById(req.user.id);
        
        // Update user stats
        user.totalStablefordPoints += points;
        
        // Keep last 5 scores for quick display
        let newScores = [...user.scores];
        if (newScores.length >= 5) newScores.shift();
        newScores.push(points);
        user.scores = newScores;
        
        await user.save();
        
        res.json({ message: 'Score added successfully', points, user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Leaderboard (Top 10) - PUBLIC
router.get('/leaderboard', async (req, res) => {
    try {
        const topUsers = await User.find({ role: 'user' })
            .select('username totalStablefordPoints scores')
            .sort({ totalStablefordPoints: -1 })
            .limit(10);
        
        let currentUserRank = 0;
        if (req.headers.authorization) {
            // Optional auth for rank
            const jwt = require('jsonwebtoken');
            try {
                const token = req.headers.authorization.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
                const user = await User.findById(decoded.id);
                if (user) {
                    currentUserRank = await User.countDocuments({ 
                        totalStablefordPoints: { $gt: user.totalStablefordPoints },
                        role: 'user'
                    }) + 1;
                }
            } catch (e) {
                // Ignore auth error for public leaderboard
            }
        }

        res.json({ leaderboard: topUsers, myRank: currentUserRank });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ... rest of the existing routes (Select Charity, Latest Draw, etc.)

// Select Charity
router.post('/select-charity', auth, async (req, res) => {
    try {
        const { charityId, contributionPercentage } = req.body;
        const user = await User.findById(req.user.id);
        
        user.currentCharity = charityId;
        user.contributionPercentage = Math.max(10, contributionPercentage || 10);
        await user.save();
        
        res.json({ message: 'Charity selection updated' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Latest Draw
router.get('/latest-draw', auth, async (req, res) => {
    try {
        const draw = await Draw.findOne({ published: true }).sort({ date: -1 });
        res.json(draw);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get User prizes
router.get('/prizes', auth, async (req, res) => {
    try {
        const prizes = await Prize.find({ userId: req.user.id }).populate('drawId');
        res.json(prizes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Upload proof (Winner Verification)
router.post('/claim-prize', auth, checkSubscription, async (req, res) => {
    try {
        const { prizeId, proofScreenshot } = req.body;
        const prize = await Prize.findOne({ _id: prizeId, userId: req.user.id });
        if (!prize) return res.status(404).json({ message: 'Prize not found' });
        
        // Ensure prize isn't already paid or verified
        if (prize.status === 'Paid' || prize.status === 'Verified') {
            return res.status(400).json({ message: 'Prize already processed' });
        }

        prize.proofScreenshot = proofScreenshot;
        // Keep status as 'Pending' or set a new one if we want. 
        // Admin Panel will see the screenshot and can 'Verify' it.
        await prize.save();
        
        res.json({ message: 'Proof submitted successfully. Waiting for admin review.', prize });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
