import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Subscription = () => {
    const { token, fetchUser } = useAuth();
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
            fetchUser(); // Sync Global State
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
            fetchUser(); // Sync Global State
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
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', marginBottom: '4rem' }}
            >
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '30px', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <ShieldCheck size={16} color="var(--accent-primary)" />
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Secure Sandbox Mode</span>
                </div>
                <h1 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '1rem', letterSpacing: '-1px' }}>Elevate Your <span className="text-gradient">Impact</span></h1>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem', lineHeight: '1.6' }}> 
                    Join a community of golfers making a real-world difference. 10% of every subscription goes directly to your selected cause.
                </p>
            </motion.div>

            {message && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass" 
                    style={{ padding: '1.25rem', marginBottom: '2.5rem', textAlign: 'center', border: `1px solid ${message.includes('Successful') ? 'var(--accent-primary)' : '#ff4d4d'}`, color: message.includes('Successful') ? 'var(--accent-primary)' : '#ff4d4d', fontWeight: 'bold' }}
                >
                    {message}
                </motion.div>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2.5rem', justifyContent: 'center', alignItems: 'stretch' }}>
                {/* Monthly Plan */}
                <motion.div 
                    whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,255,204,0.1)' }}
                    className="glass" 
                    style={{ 
                        padding: '3rem 2.5rem', 
                        width: '100%', 
                        maxWidth: '380px', 
                        display: 'flex', 
                        flexDirection: 'column',
                        border: currentPlan === 'monthly' ? '2px solid var(--accent-primary)' : '1px solid var(--glass-border)',
                        position: 'relative',
                        transition: 'all 0.3s ease'
                    }}
                >
                    {currentPlan === 'monthly' && (
                        <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--accent-primary)', color: '#000', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.7rem', fontWeight: '800' }}>
                            ACTIVE PLAN
                        </div>
                    )}
                    <h3 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem' }}>Monthly Pass</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>Flexible access for casual players.</p>
                    <div style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '3.5rem', fontWeight: '900', display: 'inline-block' }}>$20</h2>
                        <span style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>/ month</span>
                    </div>
                    
                    <ul style={{ listStyle: 'none', padding: 0, marginBottom: '3rem', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.95rem' }}><CheckCircle size={20} color="var(--accent-primary)" /> Unlimited Score Posting</li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.95rem' }}><CheckCircle size={20} color="var(--accent-primary)" /> Monthly Prize Draw Entry</li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.95rem' }}><CheckCircle size={20} color="var(--accent-primary)" /> Personalized Impact Stats</li>
                    </ul>

                    <button 
                        className={currentPlan === 'monthly' ? "glass" : "btn-primary"} 
                        style={{ 
                            width: '100%', 
                            padding: '1.25rem', 
                            fontSize: '1rem',
                            fontWeight: '800',
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                        onClick={() => currentPlan === 'monthly' ? handleCancel() : subscribe('monthly')}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : (currentPlan === 'monthly' ? 'Cancel Subscription' : 'Upgrade to Monthly')}
                    </button>
                </motion.div>

                {/* Yearly Plan */}
                <motion.div 
                    whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(255,77,148,0.1)' }}
                    className="glass" 
                    style={{ 
                        padding: '3rem 2.5rem', 
                        width: '100%', 
                        maxWidth: '380px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        border: currentPlan === 'yearly' ? '2px solid var(--accent-secondary)' : '1px solid var(--accent-secondary)', 
                        position: 'relative',
                        transition: 'all 0.3s ease',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,77,148,0.02) 100%)'
                    }}
                >
                    <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)', background: 'var(--accent-secondary)', color: 'white', padding: '0.4rem 1.25rem', borderRadius: '30px', fontSize: '0.8rem', fontWeight: '900', letterSpacing: '1px', boxShadow: '0 10px 20px rgba(255,77,148,0.3)' }}>
                        BEST VALUE (2 MONTHS FREE)
                    </div>
                    {currentPlan === 'yearly' && (
                        <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'var(--accent-secondary)', color: '#fff', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.7rem', fontWeight: '800' }}>
                            ACTIVE PLAN
                        </div>
                    )}
                    <h3 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem' }}>Yearly Legend</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>Serious impact for dedicated golfers.</p>
                    <div style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '3.5rem', fontWeight: '900', display: 'inline-block' }}>$200</h2>
                        <span style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>/ year</span>
                    </div>
                    
                    <ul style={{ listStyle: 'none', padding: 0, marginBottom: '3rem', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.95rem' }}><CheckCircle size={20} color="var(--accent-primary)" /> All Monthly Features</li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.95rem' }}><CheckCircle size={20} color="var(--accent-primary)" /> Priority Payout Processing</li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.95rem' }}><CheckCircle size={20} color="var(--accent-primary)" /> Exclusive "Legacy" Badge</li>
                    </ul>

                    <button 
                        className="btn-primary" 
                        style={{ 
                            width: '100%', 
                            padding: '1.25rem', 
                            fontSize: '1.1rem',
                            fontWeight: '900',
                            background: currentPlan === 'yearly' ? 'transparent' : 'var(--accent-secondary)',
                            border: currentPlan === 'yearly' ? '1px solid rgba(255,255,255,0.2)' : 'none',
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                        onClick={() => currentPlan === 'yearly' ? handleCancel() : subscribe('yearly')}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : (currentPlan === 'yearly' ? 'Cancel Subscription' : 'Become a Legend')}
                    </button>
                </motion.div>
            </div>

            <div style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <p>Protected by industry-standard encryption. Payments processed securely via Stripe Sandbox.</p>
            </div>
        </div>
    );
};

export default Subscription;
