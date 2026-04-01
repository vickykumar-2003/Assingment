const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/auth');
const User = require('../models/User');
const Charity = require('../models/Charity');
const Draw = require('../models/Draw');
const Prize = require('../models/Prize');
const { sendDrawResultEmail } = require('../utils/emailService');

// ============================================================
// REPORTS & ANALYTICS (12 KPI GRID)
// ============================================================

router.get('/analytics', auth, admin, async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const activeSubscriptions = await User.countDocuments({ subscriptionStatus: 'active' });
        const charitiesCount = await Charity.countDocuments();
        const drawsCount = await Draw.countDocuments();
        const totalWinners = await Prize.countDocuments();
        const paidPrizesCount = await Prize.countDocuments({ status: 'Paid' });
        const pendingPrizesCount = await Prize.countDocuments({ status: 'Pending' });
        const verifiedPrizesCount = await Prize.countDocuments({ status: 'Verified' });

        // Revenue calculations
        const monthlyUsers = await User.countDocuments({ subscriptionPlan: 'monthly', subscriptionStatus: 'active' });
        const yearlyUsers = await User.countDocuments({ subscriptionPlan: 'yearly', subscriptionStatus: 'active' });
        const totalRevenue = (monthlyUsers * 20) + (yearlyUsers * 200 / 12); // Monthly equivalent

        const prizePool = totalRevenue * 0.5; // 50% to prize pool
        const charityPool = totalRevenue * 0.1; // 10% to charity

        // Average Points Calculation
        const usersWithPoints = await User.aggregate([
            { $group: { _id: null, avgPoints: { $avg: '$totalStablefordPoints' } } }
        ]);
        const avgPoints = usersWithPoints.length > 0 ? usersWithPoints[0].avgPoints : 0;

        // Total paid out
        const paidPrizesAgg = await Prize.aggregate([
            { $match: { status: 'Paid' } },
            { $group: { _id: null, total: { $sum: '$prizeAmount' } } }
        ]);
        const totalPaidOut = paidPrizesAgg.length > 0 ? paidPrizesAgg[0].total : 0;

        // Draw statistics
        const draws = await Draw.find().sort({ date: -1 }).limit(5);
        const drawStats = draws.map(d => ({
            date: d.date,
            numbers: d.winningNumbers,
            pool: d.totalPrizePool,
            published: d.published,
            fiveMatch: d.stats?.fiveMatchCount || 0,
            fourMatch: d.stats?.fourMatchCount || 0,
            threeMatch: d.stats?.threeMatchCount || 0,
        }));

        // Charity breakdown
        const charityUsers = await User.aggregate([
            { $match: { subscriptionStatus: 'active' } },
            { $group: { _id: '$currentCharity', count: { $sum: 1 } } }
        ]);
        const charityContributionBreakdown = await Promise.all(charityUsers.map(async (c) => {
            const charity = await Charity.findById(c._id);
            return {
                name: charity ? charity.name : 'Unknown',
                count: c.count,
                totalContribution: Math.round((c.count / activeSubscriptions) * charityPool) || 0
            };
        }));

        res.json({
            // The 12 primary KPIs
            userCount, 
            activeSubscriptions, 
            totalRevenue: Math.round(totalRevenue),
            prizePool: Math.round(prizePool),
            charityPool: Math.round(charityPool),
            totalWinners, 
            pendingPrizes: pendingPrizesCount, 
            verifiedPrizes: verifiedPrizesCount, 
            paidPrizes: paidPrizesCount, 
            avgPoints: avgPoints.toFixed(1),
            drawsCount,
            charitiesCount,

            // Detailed data
            totalPaidOut,
            monthlyUsers, yearlyUsers,
            recentDraws: drawStats,
            charityContributionBreakdown
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ============================================================
// USER MANAGEMENT
// ============================================================

// Get all users
router.get('/users', auth, admin, async (req, res) => {
    try {
        const users = await User.find().select('-password').populate('currentCharity').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Edit user profile (admin)
router.put('/user/:id', auth, admin, async (req, res) => {
    try {
        const { username, email, role, subscriptionStatus, subscriptionPlan, contributionPercentage } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { username, email, role, subscriptionStatus, subscriptionPlan, contributionPercentage },
            { new: true, runValidators: true }
        ).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User updated', user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Edit user scores (admin) - Modified for 0-4 point system
router.put('/user/:id/scores', auth, admin, async (req, res) => {
    try {
        const { scores } = req.body;
        if (!Array.isArray(scores)) {
            return res.status(400).json({ message: 'Scores must be an array' });
        }
        // Validation: 0=double-bogey, 1=bogey, 2=par, 3=birdie, 4=eagle
        for (const s of scores) {
            if (s < 0 || s > 4) return res.status(400).json({ message: 'Points must be 0, 1, 2, 3, or 4' });
        }
        
        const totalPoints = scores.reduce((a, b) => a + b, 0);
        
        const user = await User.findByIdAndUpdate(
            req.params.id, 
            { scores, totalStablefordPoints: totalPoints }, 
            { new: true }
        ).select('-password');
        
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'Scores updated', user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Manage user subscription (admin)
router.put('/user/:id/subscription', auth, admin, async (req, res) => {
    // ...
    try {
        const { subscriptionStatus, subscriptionPlan } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { subscriptionStatus, subscriptionPlan },
            { new: true }
        ).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'Subscription updated', user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ============================================================
// DRAW MANAGEMENT
// ============================================================

// Get all draws
router.get('/draws', auth, admin, async (req, res) => {
    try {
        const draws = await Draw.find().sort({ date: -1 });
        res.json(draws);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Run Draw (Random or Algorithm)
router.post('/run-draw', auth, admin, async (req, res) => {
    try {
        const { prizePool, drawType } = req.body;

        let winningNumbers;
        if (drawType === 'algorithm') {
            // Algorithm-based: weighted towards less-picked numbers
            const users = await User.find({ subscriptionStatus: 'active' });
            const frequency = {};
            users.forEach(u => u.scores.forEach(s => { frequency[s] = (frequency[s] || 0) + 1; }));
            // Pick numbers with lowest frequency (harder to win)
            const allNums = Array.from({ length: 45 }, (_, i) => i + 1);
            allNums.sort((a, b) => (frequency[a] || 0) - (frequency[b] || 0));
            winningNumbers = allNums.slice(0, 5).sort((a, b) => a - b);
        } else {
            // Random
            const pool = new Set();
            while (pool.size < 5) {
                pool.add(Math.floor(Math.random() * 45) + 1);
            }
            winningNumbers = [...pool].sort((a, b) => a - b);
        }

        const draw = new Draw({
            winningNumbers,
            totalPrizePool: prizePool || 1000,
            published: false
        });
        await draw.save();

        // Find winners
        const users = await User.find({ subscriptionStatus: 'active' });
        let fiveMatch = [], fourMatch = [], threeMatch = [];

        users.forEach(user => {
            if (!user.scores || user.scores.length === 0) return;
            const matches = user.scores.filter(s => winningNumbers.includes(s)).length;
            if (matches === 5) fiveMatch.push(user._id);
            else if (matches === 4) fourMatch.push(user._id);
            else if (matches === 3) threeMatch.push(user._id);
        });

        // Prize distribution: 5-match=40%, 4-match=35%, 3-match=25%
        const calculatePrize = (total, percent, count) => count > 0 ? Math.round((total * percent / 100) / count) : 0;

        const prize5 = calculatePrize(draw.totalPrizePool, 40, fiveMatch.length);
        const prize4 = calculatePrize(draw.totalPrizePool, 35, fourMatch.length);
        const prize3 = calculatePrize(draw.totalPrizePool, 25, threeMatch.length);

        const prizes = [
            ...fiveMatch.map(id => ({ userId: id, drawId: draw._id, matchCategory: '5-match', prizeAmount: prize5 })),
            ...fourMatch.map(id => ({ userId: id, drawId: draw._id, matchCategory: '4-match', prizeAmount: prize4 })),
            ...threeMatch.map(id => ({ userId: id, drawId: draw._id, matchCategory: '3-match', prizeAmount: prize3 }))
        ];

        if (prizes.length > 0) {
            await Prize.insertMany(prizes);
        }

        // Email notifications
        users.forEach(u => {
            sendDrawResultEmail(u.email, winningNumbers);
        });

        draw.stats = {
            fiveMatchCount: fiveMatch.length,
            fourMatchCount: fourMatch.length,
            threeMatchCount: threeMatch.length
        };
        await draw.save();

        res.json({
            message: 'Draw completed',
            draw,
            winnersCount: prizes.length,
            drawType: drawType || 'random',
            breakdown: {
                fiveMatch: fiveMatch.length,
                fourMatch: fourMatch.length,
                threeMatch: threeMatch.length
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Simulate Draw (does NOT save to DB)
router.post('/simulate-draw', auth, admin, async (req, res) => {
    try {
        const { prizePool, drawType } = req.body;

        let winningNumbers;
        if (drawType === 'algorithm') {
            const users = await User.find({ subscriptionStatus: 'active' });
            const frequency = {};
            users.forEach(u => u.scores.forEach(s => { frequency[s] = (frequency[s] || 0) + 1; }));
            const allNums = Array.from({ length: 45 }, (_, i) => i + 1);
            allNums.sort((a, b) => (frequency[a] || 0) - (frequency[b] || 0));
            winningNumbers = allNums.slice(0, 5).sort((a, b) => a - b);
        } else {
            const pool = new Set();
            while (pool.size < 5) {
                pool.add(Math.floor(Math.random() * 45) + 1);
            }
            winningNumbers = [...pool].sort((a, b) => a - b);
        }

        const pool = prizePool || 1000;
        const users = await User.find({ subscriptionStatus: 'active' });
        let fiveMatch = 0, fourMatch = 0, threeMatch = 0;

        users.forEach(user => {
            if (!user.scores || user.scores.length === 0) return;
            const matches = user.scores.filter(s => winningNumbers.includes(s)).length;
            if (matches === 5) fiveMatch++;
            else if (matches === 4) fourMatch++;
            else if (matches === 3) threeMatch++;
        });

        res.json({
            message: 'Simulation complete (NOT saved)',
            simulation: true,
            winningNumbers,
            drawType: drawType || 'random',
            prizePool: pool,
            totalParticipants: users.length,
            breakdown: { fiveMatch, fourMatch, threeMatch },
            estimatedPayouts: {
                fiveMatchPrize: fiveMatch > 0 ? Math.round(pool * 0.4 / fiveMatch) : 0,
                fourMatchPrize: fourMatch > 0 ? Math.round(pool * 0.35 / fourMatch) : 0,
                threeMatchPrize: threeMatch > 0 ? Math.round(pool * 0.25 / threeMatch) : 0,
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Publish Draw Results
router.patch('/draw/:id/publish', auth, admin, async (req, res) => {
    try {
        const draw = await Draw.findByIdAndUpdate(req.params.id, { published: true }, { new: true });
        if (!draw) return res.status(404).json({ message: 'Draw not found' });
        res.json({ message: 'Draw published successfully', draw });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ============================================================
// WINNERS MANAGEMENT
// ============================================================

// Get all prizes with user details
router.get('/prizes', auth, admin, async (req, res) => {
    try {
        const prizes = await Prize.find().populate('userId', 'username email').populate('drawId', 'winningNumbers date').sort({ createdAt: -1 });
        res.json(prizes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Verify/Reject/Pay prize
router.post('/verify-prize', auth, admin, async (req, res) => {
    try {
        const { prizeId, status, notes } = req.body;
        const prize = await Prize.findById(prizeId);
        if (!prize) return res.status(404).json({ message: 'Prize not found' });

        prize.status = status; // 'Verified', 'Rejected', 'Paid'
        if (notes) prize.notes = notes;
        if (status === 'Verified') prize.verifiedAt = new Date();
        if (status === 'Paid') prize.paidAt = new Date();

        await prize.save();
        res.json({ message: `Prize updated to ${status}` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ============================================================
// CHARITY MANAGEMENT
// ============================================================

// Get all charities (admin)
router.get('/charities', auth, admin, async (req, res) => {
    try {
        const charities = await Charity.find().sort({ createdAt: -1 });
        res.json(charities);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create Charity
router.post('/charity', auth, admin, async (req, res) => {
    try {
        const { name, description, image, website, minContribution } = req.body;
        const charity = new Charity({ name, description, image, website, minContribution: minContribution || 10 });
        await charity.save();
        res.status(201).json({ message: 'Charity created', charity });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update Charity
router.put('/charity/:id', auth, admin, async (req, res) => {
    try {
        const charity = await Charity.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!charity) return res.status(404).json({ message: 'Charity not found' });
        res.json({ message: 'Charity updated', charity });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete Charity
router.delete('/charity/:id', auth, admin, async (req, res) => {
    try {
        const charity = await Charity.findByIdAndDelete(req.params.id);
        if (!charity) return res.status(404).json({ message: 'Charity not found' });
        res.json({ message: 'Charity deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
