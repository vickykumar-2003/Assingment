const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    subscriptionStatus: { type: String, enum: ['active', 'expired', 'cancelled', 'inactive'], default: 'inactive' },
    subscriptionPlan: { type: String, enum: ['monthly', 'yearly', 'none'], default: 'none' },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
    lastPaymentStatus: { type: String },
    scores: { 
        type: [Number], 
        validate: [arrayLimit, '{PATH} exceeds the limit of 5']
    },
    totalStablefordPoints: { type: Number, default: 0 },
    subscriptionStartDate: { type: Date },
    subscriptionExpiryDate: { type: Date },
    currentCharity: { type: mongoose.Schema.Types.ObjectId, ref: 'Charity' },
    contributionPercentage: { type: Number, min: 10, default: 10 },
    winnings: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

userSchema.virtual('isActive').get(function() {
    return this.subscriptionStatus === 'active' && (!this.subscriptionExpiryDate || this.subscriptionExpiryDate > new Date());
});

function arrayLimit(val) {
    return val.length <= 5;
}

// Password hashing before saving
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
