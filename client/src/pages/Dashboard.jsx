import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Trophy, TrendingUp, Heart, Plus, History, Share2, Award, Lock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800';

const Dashboard = () => {
    const { user, token } = useAuth();
    const [profile, setProfile] = useState(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [latestDraw, setLatestDraw] = useState(null);
    const [prizes, setPrizes] = useState([]);
    const [rank, setRank] = useState('--');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (profile?.currentCharity?.image) {
            setImgSrc(profile.currentCharity.image);
        }
    }, [profile]);

    // Score Form
    const [par, setPar] = useState('');
    const [strokes, setStrokes] = useState('');

    const [showClaimModal, setShowClaimModal] = useState(false);
    const [selectedPrize, setSelectedPrize] = useState(null);
    const [proof, setProof] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchProfile();
        fetchLatestDraw();
        fetchPrizes();
        fetchRank();
    }, []);

    const fetchRank = async () => {
        try {
            const res = await axios.get('/api/user/leaderboard');
            setRank(res.data.myRank);
        } catch (err) { console.error('Fetch rank error', err); }
    };

    const fetchPrizes = async () => {
        try {
            const res = await axios.get('/api/user/prizes');
            setPrizes(res.data);
        } catch (err) { console.error('Fetch prizes error', err); }
    };

    const fetchLatestDraw = async () => {
        try {
            const res = await axios.get('/api/user/latest-draw');
            setLatestDraw(res.data);
        } catch (err) { console.error('Fetch draw error', err); }
    };

    const fetchProfile = async () => {
        try {
            const res = await axios.get('/api/user/profile');
            setProfile(res.data);
        } catch (err) {
            console.error('Fetch profile error', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddScore = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/user/scores', { 
                par: parseInt(par), 
                strokes: parseInt(strokes) 
            });
            setProfile(res.data.user);
            setPar('');
            setStrokes('');
            alert(`Great play! You earned ${res.data.points} Stableford points.`);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add score');
        }
    };

    const handleClaim = async (e) => {
        e.preventDefault();
        if (!proof) return alert('Please provide proof (Screenshot URL)');
        setIsSubmitting(true);
        try {
            await axios.post('/api/user/claim-prize', { prizeId: selectedPrize._id, proofScreenshot: proof });
            setShowClaimModal(false);
            setProof('');
            fetchPrizes();
        } catch (err) {
            alert(err.response?.data?.message || 'Verification failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getDaysRemaining = () => {
        if (!profile?.subscriptionExpiryDate) return profile?.subscriptionStatus === 'active' ? 'Active' : '0';
        const diff = new Date(profile.subscriptionExpiryDate) - new Date();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return Math.max(0, days);
    };

    if (loading) return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem' }}>
            <div style={{ marginBottom: '3rem' }}>
                <div className="skeleton" style={{ height: '50px', width: '300px', marginBottom: '1rem' }} />
                <div className="skeleton" style={{ height: '20px', width: '500px' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1.5rem' }}>
                    <div className="skeleton" style={{ flex: 1, height: '120px' }} />
                    <div className="skeleton" style={{ flex: 1, height: '120px' }} />
                    <div className="skeleton" style={{ flex: 1, height: '120px' }} />
                </div>
                <div className="skeleton" style={{ height: '350px' }} />
                <div className="skeleton" style={{ height: '250px' }} />
                <div className="skeleton" style={{ height: '350px' }} />
            </div>
        </div>
    );

    const daysRemaining = getDaysRemaining();
    const totalDonations = Math.round((profile?.contributionPercentage / 100) * 20 * (profile?.subscriptionPlan === 'yearly' ? 12 : 1)); // Simplified calculation

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
            <header className="mobile-stack" style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>Welcome, <span className="text-gradient">{profile?.username}</span></h1>
                    <p style={{ color: 'var(--text-secondary)' }}>You're currently ranked in the top {((rank / 100) * 100).toFixed(0) || '...'}% of players this month.</p>
                </div>
                {/* Global Subscription Paywall Overlay */}
                {(profile?.subscriptionStatus !== 'active') && (
                    <div style={{ position: 'fixed', top: '0', left: 0, right: 0, bottom: 0, zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(12px)', background: 'rgba(0,0,0,0.7)', padding: '1rem' }}>
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }}
                            className="glass" 
                            style={{ 
                                padding: '3.5rem 2.5rem', 
                                textAlign: 'center', 
                                maxWidth: '500px', 
                                width: '100%',
                                border: '1px solid rgba(0, 255, 204, 0.3)', 
                                boxShadow: '0 0 50px rgba(0, 255, 204, 0.1)',
                                borderRadius: '32px',
                                background: 'linear-gradient(180deg, rgba(20, 20, 20, 0.9) 0%, rgba(10, 10, 10, 0.95) 100%)'
                            }}
                        >
                            <div style={{ marginBottom: '2rem' }}>
                                <motion.div 
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    style={{ display: 'inline-block' }}
                                >
                                    <Award size={64} color="var(--accent-primary)" style={{ filter: 'drop-shadow(0 0 15px rgba(0, 255, 204, 0.5))' }} />
                                </motion.div>
                            </div>

                            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '0.75rem', letterSpacing: '-1px' }}>Legendary Access</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '2.5rem', lineHeight: '1.5' }}>
                                Your journey to the top of the leaderboard starts with an active subscription.
                            </p>

                            <div style={{ textAlign: 'left', background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '20px', marginBottom: '2.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <p style={{ fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent-primary)', marginBottom: '1rem', letterSpacing: '1px' }}>What you get:</p>
                                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: '#fff' }}>
                                        <CheckCircle size={16} color="var(--accent-primary)" /> Post unlimited scores weekly
                                    </li>
                                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: '#fff' }}>
                                        <CheckCircle size={16} color="var(--accent-primary)" /> Entry into the $10,000 Monthly Draw
                                    </li>
                                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: '#fff' }}>
                                        <CheckCircle size={16} color="var(--accent-primary)" /> 10% direct donation to your charity
                                    </li>
                                </ul>
                            </div>

                            <button className="btn-primary" style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem', fontWeight: '900', borderRadius: '16px' }} onClick={() => window.location.href='/subscribe'}>
                                Upgrade Now to Play
                            </button>
                            
                            <div style={{ marginTop: '1.5rem', display: 'flex', itemsAlign: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff4d4d', alignSelf: 'center' }}></div>
                                <p style={{ fontSize: '0.8rem', fontWeight: '700', color: '#ff4d4d' }}>Status: {profile?.subscriptionStatus?.toUpperCase() || 'INACTIVE'}</p>
                            </div>
                        </motion.div>
                    </div>
                )}
                {/* Emotional Message Box */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass" 
                    style={{ padding: '1rem 1.5rem', border: '1px solid var(--accent-primary)', textAlign: 'center', width: '100%', maxWidth: '300px' }}
                >
                    <Heart size={20} color="var(--accent-primary)" style={{ marginBottom: '0.5rem', display: 'inline-block' }} />
                    <p style={{ fontSize: '0.9rem', fontWeight: '700' }}>Impact Report</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>"You've helped support <strong>{Math.floor(totalDonations / 5) || 1} people</strong> through your contributions this month."</p>
                </motion.div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                
                {/* Stats Grid */}
                <div style={{ gridColumn: window.innerWidth < 1024 ? 'span 1' : 'span 2', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div className="glass" style={{ padding: '1.5rem' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Subscription</p>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-secondary)' }}>{profile?.subscriptionPlan?.toUpperCase()}</h3>
                        <p style={{ fontSize: '0.8rem', color: daysRemaining < 7 ? '#ff4d4d' : 'var(--text-secondary)' }}>{typeof daysRemaining === 'number' ? `${daysRemaining} days remaining` : daysRemaining}</p>
                    </div>
                    <div className="glass" style={{ padding: '1.5rem' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Total Charity</p>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-primary)' }}>${totalDonations}</h3>
                        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', marginTop: '0.5rem' }}>
                            <div style={{ width: '65%', height: '100%', background: 'var(--accent-primary)', borderRadius: '10px' }}></div>
                        </div>
                    </div>
                    <div className="glass" style={{ padding: '1.5rem' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Total Points</p>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{profile?.totalStablefordPoints || 0} pts</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)' }}>Rank: #{rank}</p>
                    </div>
                </div>

                {/* Score Management */}
                <div className="glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <TrendingUp size={20} color="var(--accent-primary)" /> Post New Score
                        </h3>
                    </div>

                    <form onSubmit={handleAddScore} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', opacity: profile?.subscriptionStatus === 'active' ? 1 : 0.5 }}>
                        {profile?.subscriptionStatus !== 'active' && (
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0,0.1)', backdropFilter: 'blur(2px)', borderRadius: '12px' }}>
                                <Lock size={24} color="#fff" />
                                <p style={{ fontSize: '0.7rem', fontWeight: '700', marginTop: '0.5rem' }}>SUBSCRIBE TO PLAY</p>
                            </div>
                        )}
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', display: 'block' }}>Course Par</label>
                                <input type="number" className="input-field" placeholder="Par (3-5)" value={par} onChange={(e) => setPar(e.target.value)} required disabled={profile?.subscriptionStatus !== 'active'} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', display: 'block' }}>Strokes Taken</label>
                                <input type="number" className="input-field" placeholder="Strokes" value={strokes} onChange={(e) => setStrokes(e.target.value)} required disabled={profile?.subscriptionStatus !== 'active'} />
                            </div>
                        </div>
                        <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.25rem' }} disabled={profile?.subscriptionStatus !== 'active'}>
                            {profile?.subscriptionStatus === 'active' ? 'Calculate Stableford Points' : 'Disabled'}
                        </button>
                    </form>

                    <div style={{ marginTop: '1rem' }}>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Your Recent Stableford Points:</p>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            {profile?.scores?.length > 0 ? [...profile.scores].reverse().map((s, i) => (
                                <motion.div key={i} initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: '800', border: '1px solid var(--glass-border)' }}>
                                    {s}
                                </motion.div>
                            )) : <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>No points yet.</p>}
                        </div>
                    </div>
                </div>

                {/* Latest Draw Info */}
                <div className="glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Trophy size={20} color="var(--accent-secondary)" /> Latest Draw Results
                    </h3>
                    
                    {latestDraw ? (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                {latestDraw.winningNumbers.map((num, i) => (
                                    <div key={i} className="animate-pulse" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid var(--accent-secondary)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.9rem', fontWeight: '800', background: 'rgba(0, 212, 255, 0.05)' }}>
                                        {num}
                                    </div>
                                ))}
                            </div>
                            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                                <p style={{ color: 'var(--accent-primary)', fontWeight: '800', fontSize: '1.2rem' }}>Pool: ${latestDraw.totalPrizePool.toLocaleString()}</p>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '0.25rem' }}>Winner verified on {new Date(latestDraw.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>No draw results published yet.</p>
                    )}
                </div >

                {/* Active Cause */}
                <div className="glass" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', borderTop: '4px solid #ff4d94', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '60px', height: '60px', background: '#ff4d94', filter: 'blur(50px)', opacity: 0.1 }}></div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.75rem', letterSpacing: '-0.5px' }}>
                            <Heart size={24} color="#ff4d94" fill="#ff4d94" /> Your Active Cause
                        </h3>
                        <button 
                            className="glass" 
                            style={{ padding: '0.6rem 1rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.05)' }} 
                            onClick={() => window.location.href='/charities'}
                        >
                            Change Foundation
                        </button>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.03)' }}>
                        <img 
                            src={imgSrc || FALLBACK_IMAGE} 
                            alt="Charity" 
                            onError={() => setImgSrc(FALLBACK_IMAGE)}
                            style={{ width: '80px', height: '80px', borderRadius: '18px', objectFit: 'cover', boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }} 
                        />
                        <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '1.1rem', fontWeight: '900', color: '#fff', marginBottom: '0.25rem' }}>{profile?.currentCharity?.name || 'No Cause Selected'}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-primary)' }}></div>
                                <span style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: '700' }}>{profile?.contributionPercentage || 10}% Contribution</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ padding: '1.25rem', background: 'rgba(255,77,148,0.03)', borderRadius: '16px', border: '1px solid rgba(255,77,148,0.1)' }}>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', fontStyle: 'italic' }}>
                            "{profile?.currentCharity?.description || 'Select a cause to start making a real-world impact through your play.'}"
                        </p>
                    </div>
                </div>
            </div>

            {/* Winner Verification System UI */}
            {prizes.length > 0 && (
                <div className="glass" style={{ marginTop: '2rem', padding: '2.5rem' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Award size={28} color="gold" /> My Winnings & Claims
                    </h3>
                    <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
                        {prizes.map((p, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '15px' }}>
                                <div>
                                    <h4 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-primary)' }}>${p.prizeAmount}</h4>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Status: <span style={{ color: p.status === 'Paid' ? 'var(--accent-primary)' : 'orange' }}>{p.status}</span></p>
                                </div>
                                {p.status === 'Pending' && !p.proofScreenshot ? (
                                    <button className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }} onClick={() => { setSelectedPrize(p); setShowClaimModal(true); }}>Claim Prize</button>
                                ) : (
                                    <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Under Review</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Claim Modal */}
            {showClaimModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(10px)' }}>
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass" style={{ maxWidth: '500px', width: '90%', padding: '2.5rem', border: '1px solid var(--accent-primary)' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>Upload Winning Proof</h2>
                        <input className="input-field" placeholder="Screenshot URL (e.g. Imgur link)" value={proof} onChange={(e) => setProof(e.target.value)} style={{ marginBottom: '1.5rem' }} />
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn-primary" style={{ flex: 1 }} onClick={handleClaim} disabled={isSubmitting}>{isSubmitting ? 'Verifying...' : 'Submit Claim'}</button>
                            <button className="glass" style={{ flex: 1 }} onClick={() => setShowClaimModal(false)}>Cancel</button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
