const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { auth } = require('../middleware/auth');
const User = require('../models/User');

// Create Subscription Session
router.post('/create-checkout-session', auth, async (req, res) => {
    try {
        const { planId } = req.body; // 'monthly' or 'yearly'
        
        // Use Stripe Price IDs from .env or placeholders for testing
        const priceId = planId === 'yearly' ? 
            (process.env.STRIPE_YEARLY_PRICE_ID || 'price_yearly_placeholder') : 
            (process.env.STRIPE_MONTHLY_PRICE_ID || 'price_monthly_placeholder');

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard?session_id={CHECKOUT_SESSION_ID}&success=true`,
            cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard?cancelled=true`,
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
        const subscriptionId = session.subscription;
        const customerId = session.customer;
        
        // Assume 1 month for monthly, 1 year for yearly (simplified)
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30); 

        await User.findByIdAndUpdate(userId, { 
            subscriptionStatus: 'active',
            stripeSubscriptionId: subscriptionId,
            stripeCustomerId: customerId,
            subscriptionExpiryDate: expiryDate
        });
    }

    if (event.type === 'customer.subscription.deleted' || event.type === 'customer.subscription.updated') {
        const subscription = event.data.object;
        const status = subscription.status; // 'active', 'canceled', 'unpaid', 'past_due'
        
        const mappedStatus = (status === 'active') ? 'active' : (status === 'canceled' ? 'cancelled' : 'expired');
        
        await User.findOneAndUpdate(
            { stripeSubscriptionId: subscription.id },
            { 
                subscriptionStatus: mappedStatus,
                subscriptionExpiryDate: new Date(subscription.current_period_end * 1000)
            }
        );
    }

    if (event.type === 'invoice.payment_succeeded') {
        const invoice = event.data.object;
        if (invoice.subscription) {
            const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
            await User.findOneAndUpdate(
                { stripeCustomerId: invoice.customer },
                { 
                    subscriptionStatus: 'active',
                    subscriptionExpiryDate: new Date(subscription.current_period_end * 1000)
                }
            );
        }
    }

    if (event.type === 'invoice.payment_failed') {
        const invoice = event.data.object;
        await User.findOneAndUpdate(
            { stripeCustomerId: invoice.customer },
            { subscriptionStatus: 'expired', lastPaymentStatus: 'failed' }
        );
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
            message: `Successfully subscribed to ${planId} plan! Welcome aboard Legend.`, 
            subscriptionStatus: 'active',
            plan: planId,
            expiryDate,
            user: {
                id: user._id,
                username: user.username,
                subscriptionStatus: user.subscriptionStatus,
                subscriptionPlan: user.subscriptionPlan,
                subscriptionExpiryDate: user.subscriptionExpiryDate
            }
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
