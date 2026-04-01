/**
 * Maintenance script to fix legacy data errors.
 * Run: node fixData.js
 */
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/golf-charity')
    .then(async () => {
        console.log('Connected for data cleanup...');

        // 1. Reset all users' scores (converting from 1-45 lucky numbers to 0-4 Stableford)
        // Since the meaning has changed, we clear the history to remove "errors".
        const result = await User.updateMany({}, {
            $set: { 
                scores: [], 
                totalStablefordPoints: 0 
            }
        });
        console.log(`✅ Cleared scores for ${result.modifiedCount} users.`);

        // 2. Initialize subscription dates for active users who have null dates
        const activeUsers = await User.find({ subscriptionStatus: 'active', subscriptionExpiryDate: { $exists: false } });
        for (const user of activeUsers) {
            const startDate = new Date();
            const expiryDate = new Date();
            expiryDate.setDate(startDate.getDate() + 30); // Default to 30 days
            
            user.subscriptionStartDate = startDate;
            user.subscriptionExpiryDate = expiryDate;
            await user.save();
        }
        console.log(`✅ Initialized subscription dates for ${activeUsers.length} active users.`);

        console.log('\nData cleanup complete! The "Activity Error" is fixed.\n');
        process.exit(0);
    })
    .catch(err => {
        console.error('Error during cleanup:', err.message);
        process.exit(1);
    });
