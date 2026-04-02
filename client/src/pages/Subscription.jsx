import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Subscription = () => {
    const { token, user: authUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [currentPlan, setCurrentPlan] = useState(null);

    React.useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await axios.get('/api/user/profile');
                setCurrentPlan(res.data.subscriptionPlan !== 'none' ? res.data.subscriptionPlan : null);
            } catch (err) { console.error(err); }
        };
        fetchStatus();
    }, []);

    const handleCancel = async () => {
        if (!window.confirm('Are you sure you want to cancel? You will lose access to premium features.')) return;
        setLoading(true);
        try {
            await axios.post('/api/payment/cancel-subscription');
            setMessage('Subscription cancelled successfully.');
            setCurrentPlan(null);
        } catch (err) {
            setMessage('Failed to cancel. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const subscribe = async (plan) => {
        setLoading(true);
        setMessage('');
        try {
            await axios.post('/api/payment/mock-subscribe', { planId: plan });
            setMessage('Payment Successful! Your subscription is now active.');
            // Redirect after 2 seconds
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 2000);
        } catch (err) {
            setMessage('Failed to process payment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
            <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>Choose Your <span className="text-gradient">Plan</span></h1>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}> Play to win big while making a tangible difference in the world. 10% of your subscription goes directly to your chosen charity.</p>
            </header>

            {message && (
                <div className="glass animate-fade-in" style={{ padding: '1rem', marginBottom: '2rem', textAlign: 'center', color: message.includes('Success') ? 'var(--accent-primary)' : '#ff4d4d', fontWeight: 'bold' }}>
                    {message}
                </div>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
                {/* Monthly Plan */}
                <motion.div 
                    whileHover={{ y: -5 }}
                    className="glass" 
                    style={{ padding: '3rem 2rem', width: '100%', maxWidth: '350px', display: 'flex', flexDirection: 'column' }}
                >
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Monthly Pass</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Perfect for casual players.</p>
                    <h2 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '2rem' }}>$20<span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/mo</span></h2>
                    
                    <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><CheckCircle size={20} color="var(--accent-primary)" /> Entry to Monthly Draw</li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><CheckCircle size={20} color="var(--accent-primary)" /> Standard Charity Split</li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><CheckCircle size={20} color="var(--accent-primary)" /> Basic Dashboard Stats</li>
                    </ul>

                    <button 
                        className="btn-primary" 
                        style={{ width: '100%', padding: '1rem', background: currentPlan === 'monthly' ? 'rgba(0,255,204,0.1)' : '' }}
                        onClick={() => currentPlan === 'monthly' ? handleCancel() : subscribe('monthly')}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : (currentPlan === 'monthly' ? 'Cancel Monthly' : 'Subscribe Monthly')}
                    </button>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textAlign: 'center', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                        <ShieldCheck size={14} /> Mock Payment Sandbox
                    </p>
                </motion.div>

                {/* Yearly Plan */}
                <motion.div 
                    whileHover={{ y: -5 }}
                    className="glass" 
                    style={{ padding: '3rem 2rem', width: '100%', maxWidth: '350px', display: 'flex', flexDirection: 'column', border: '1px solid var(--accent-secondary)', position: 'relative' }}
                >
                    <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)', background: 'var(--accent-secondary)', color: 'white', padding: '0.25rem 1rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>
                        BEST VALUE
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Yearly Legend</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>For dedicated philanthropists.</p>
                    <h2 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '2rem' }}>$200<span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/yr</span></h2>
                    
                    <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><CheckCircle size={20} color="var(--accent-primary)" /> 2 Months Free!</li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><CheckCircle size={20} color="var(--accent-primary)" /> Entry to All Draws</li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><CheckCircle size={20} color="var(--accent-primary)" /> Priority Payout Verification</li>
                    </ul>

                    <button 
                        className="btn-primary" 
                        style={{ width: '100%', padding: '1rem', background: currentPlan === 'yearly' ? 'rgba(255,102,153,0.1)' : 'var(--accent-secondary)' }}
                        onClick={() => currentPlan === 'yearly' ? handleCancel() : subscribe('yearly')}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : (currentPlan === 'yearly' ? 'Cancel Yearly' : 'Subscribe Yearly')}
                    </button>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textAlign: 'center', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                        <ShieldCheck size={14} /> Mock Payment Sandbox
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Subscription;
