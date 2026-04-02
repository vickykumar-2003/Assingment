const User = require('../models/User');

const checkSubscription = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(401).json({ error: 'Please authenticate.' });
        }

        const now = new Date();
        
        // Real-time expiry check
        if (user.subscriptionStatus === 'active' && user.subscriptionExpiryDate && user.subscriptionExpiryDate < now) {
            user.subscriptionStatus = 'expired';
            await user.save();
        }

        // If not active, block access to premium features
        if (user.subscriptionStatus !== 'active') {
            return res.status(403).json({ 
                error: 'Subscription Required', 
                message: 'This feature is only available to active subscribers. Please upgrade your plan to continue.',
                status: user.subscriptionStatus
            });
        }

        next();
    } catch (e) {
        res.status(500).json({ error: 'Internal Server Error during subscription check.' });
    }
};

module.exports = { checkSubscription };
