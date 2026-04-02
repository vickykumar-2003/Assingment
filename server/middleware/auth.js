const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const user = await User.findOne({ _id: decoded.id });

        if (!user) {
            throw new Error();
        }

        // Real-time subscription check on every request
        const now = new Date();
        if (user.role === 'user' && user.subscriptionStatus === 'active' && user.subscriptionExpiryDate && user.subscriptionExpiryDate < now) {
            user.subscriptionStatus = 'expired';
            await user.save();
        }

        req.token = token;
        req.user = user;
        req.isSubscribed = user.subscriptionStatus === 'active' || user.role === 'admin';
        next();
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

const admin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send({ error: 'Access denied. Admin only.' });
    }
    next();
};

module.exports = { auth, admin };
