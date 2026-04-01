const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { auth } = require('../middleware/auth');
const User = require('../models/User');

// Create Subscription Session
router.post('/create-checkout-session', auth, async (req, res) => {
    try {
        const { planId } = req.body; // 'monthly' or 'yearly'
        const priceId = planId === 'yearly' ? 'price_yearly_id' : 'price_monthly_id';

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.CLIENT_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/dashboard`,
            metadata: {
                userId: req.user.id.toString(),
            },
        });

        res.json({ id: session.id, url: session.url });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Stripe Webhook (To handle subscription success)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.metadata.userId;
        
        await User.findByIdAndUpdate(userId, { subscriptionStatus: 'active' });
    }

    res.json({ received: true });
});

// Mock Subscribe (No real Stripe needed)
router.post('/mock-subscribe', auth, async (req, res) => {
    try {
        const { planId } = req.body; // 'monthly' or 'yearly'
        if (!['monthly', 'yearly'].includes(planId)) {
            return res.status(400).json({ message: 'Invalid plan. Choose monthly or yearly.' });
        }

        const user = await User.findById(req.user.id);
        const startDate = new Date();
        const expiryDate = new Date();
        
        if (planId === 'monthly') {
            expiryDate.setDate(startDate.getDate() + 30);
        } else if (planId === 'yearly') {
            expiryDate.setDate(startDate.getDate() + 365);
        }

        user.subscriptionStatus = 'active';
        user.subscriptionPlan = planId;
        user.subscriptionStartDate = startDate;
        user.subscriptionExpiryDate = expiryDate;
        await user.save();

        res.json({ 
            message: `Successfully subscribed to ${planId} plan!`, 
            subscriptionStatus: 'active',
            expiryDate
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Cancel Subscription
router.post('/cancel-subscription', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.subscriptionStatus = 'cancelled';
        await user.save();
        res.json({ message: 'Subscription cancelled successfully.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
