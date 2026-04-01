/**
 * Creates an admin user for testing.
 * Run: node createAdmin.js
 */
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const ADMIN_EMAIL    = 'admin@golf.com';
const ADMIN_PASSWORD = 'Admin@1234';
const ADMIN_USERNAME = 'superadmin';

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/golf-charity')
    .then(async () => {
        console.log('Connected to MongoDB...');

        const existing = await User.findOne({ email: ADMIN_EMAIL });
        if (existing) {
            // If already exists, ensure role is admin
            existing.role = 'admin';
            existing.subscriptionStatus = 'active';
            await existing.save();
            console.log(`\n✅ Admin user already exists. Role set to admin.\n`);
        } else {
            const admin = new User({
                username: ADMIN_USERNAME,
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD,
                role: 'admin',
                subscriptionStatus: 'active',
                subscriptionPlan: 'yearly',
            });
            await admin.save();
            console.log(`\n✅ Admin user created!\n`);
        }

        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`  Email    : ${ADMIN_EMAIL}`);
        console.log(`  Password : ${ADMIN_PASSWORD}`);
        console.log(`  Role     : admin`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
        process.exit(0);
    })
    .catch(err => {
        console.error('Error:', err.message);
        process.exit(1);
    });
