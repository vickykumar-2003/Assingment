import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, Award, TrendingUp, Users, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

const API = 'http://localhost:5000/api/user';

const Leaderboard = () => {
    const [data, setData] = useState({ leaderboard: [], myRank: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            // Send token if available for ranking
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const res = await axios.get(`${API}/leaderboard`, { headers });
            setData(res.data);
        } catch (err) {
            console.error('Error fetching leaderboard:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div style={{ display: 'grid', placeItems: 'center', height: '60vh', color: 'var(--text-secondary)' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                <Trophy size={40} />
            </motion.div>
            <p style={{ marginTop: '1rem', letterSpacing: '2px', fontSize: '0.8rem' }}>CALCULATING WORLD RANKINGS...</p>
        </div>
    );

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
            <header style={{ textAlign: 'center', marginBottom: '5rem' }}>
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }}
                    style={{ display: 'inline-flex', padding: '1.5rem', background: 'rgba(0,245,160,0.1)', borderRadius: '24px', marginBottom: '1.5rem' }}
                >
                    <Trophy size={64} color="var(--accent-primary)" />
                </motion.div>
                <h1 style={{ fontSize: '4rem', fontWeight: '900', letterSpacing: '-2px', lineHeight: 1 }}>Global <span className="text-gradient">Leaderboard</span></h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', marginTop: '1rem' }}>The elite Stableford players competing for charity world-wide.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: data.leaderboard?.length > 0 ? '1.5fr 1fr' : '1fr', gap: '3rem' }}>
                {/* Main Leaderboard Table */}
                <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="glass" style={{ padding: '3rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '800', fontSize: '1.5rem' }}><Users size={24} /> Hall of Fame</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)' }}></div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Live Updates</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {data.leaderboard?.length > 0 ? (
                            data.leaderboard.map((user, index) => (
                                <motion.div
                                    key={user._id}
                                    whileHover={{ x: 5, background: 'rgba(255,255,255,0.03)' }}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '1.25rem 2rem',
                                        borderRadius: '16px',
                                        background: 'rgba(255,255,255,0.01)',
                                        border: `1px solid ${index === 0 ? 'rgba(0,245,160,0.2)' : 'rgba(255,255,255,0.05)'}`
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                        <span style={{ 
                                            width: '40px', 
                                            fontSize: '1.25rem',
                                            fontWeight: '900', 
                                            color: index === 0 ? 'var(--accent-primary)' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : 'var(--text-secondary)' 
                                        }}>
                                            #{index + 1}
                                        </span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'grid', placeItems: 'center', fontWeight: '900' }}>{(user.username || 'U')[0]}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                {index === 0 && <Crown size={18} color="gold" />}
                                                <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>{user.username}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontWeight: '900', color: 'var(--accent-primary)', fontSize: '1.5rem' }}>{user.totalStablefordPoints || 0} <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>PTS</span></p>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>AVG ACTIVITY: {(user.totalStablefordPoints / (user.scores?.length || 1)).toFixed(1)}</span>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-secondary)' }}>
                                <p style={{ fontSize: '1.25rem', fontWeight: '700' }}>No world rankings recorded yet.</p>
                                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Be the first champion to climb the leaderboard!</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Sidebar Stats */}
                {data.leaderboard?.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="glass" style={{ padding: '3rem', textAlign: 'center', borderTop: '4px solid var(--accent-secondary)' }}>
                            <Award size={48} color="var(--accent-secondary)" style={{ marginBottom: '1.5rem' }} />
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '700' }}>Personal Rank</p>
                            <h2 style={{ fontSize: '5rem', fontWeight: '900', lineHeight: 1, margin: '1rem 0' }}>{data.myRank ? `#${data.myRank}` : '--'}</h2>
                            {data.myRank === 0 && <p style={{ fontSize: '0.85rem', color: 'var(--accent-secondary)' }}>Login to see your position!</p>}
                            {data.myRank > 0 && <p style={{ fontSize: '0.85rem', color: 'var(--accent-secondary)', fontWeight: '700' }}>TOP {(data.myRank / data.leaderboard.length * 100).toFixed(0)}% OF PLAYERS</p>}
                        </motion.div>

                        <div className="glass" style={{ padding: '3rem' }}>
                            <h4 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><TrendingUp size={20} /> Hall Rules</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <RuleItem icon="⛳" label="Consistent Performance" detail="Regularly posting scorecards increases visibility." />
                                <RuleItem icon="⭐" label="Stableford Scoring" detail="Par = 2 pts, Birdie = 3 pts, Eagle = 4 pts." />
                                <RuleItem icon="🛡️" label="Fair Play" detail="Adherence to R&A and USGA rules is mandatory." />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const RuleItem = ({ icon, label, detail }) => (
    <div style={{ display: 'flex', gap: '1rem' }}>
        <div style={{ fontSize: '1.5rem' }}>{icon}</div>
        <div>
            <p style={{ fontWeight: '800', fontSize: '0.95rem' }}>{label}</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{detail}</p>
        </div>
    </div>
);

export default Leaderboard;
