import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
    ShieldCheck, Play, Users, BarChart3, CheckCircle, XCircle,
    Heart, Trash2, Edit3, Plus, DollarSign, Trophy, Settings,
    TrendingUp, Eye, Save, RefreshCw, Send, Award, PieChart,
    ChevronRight, ArrowUpRight, CloudLightning, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API = 'http://localhost:5000/api/admin';

const AdminPanel = () => {
    const { token } = useAuth();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [prizes, setPrizes] = useState([]);
    const [users, setUsers] = useState([]);
    const [charities, setCharities] = useState([]);
    const [draws, setDraws] = useState([]);
    const [view, setView] = useState('analytics');
    const [toastMsg, setToastMsg] = useState('');

    // Draw config
    const [drawType, setDrawType] = useState('random');
    const [drawPool, setDrawPool] = useState(1000);
    const [simResult, setSimResult] = useState(null);

    // Charity form
    const [showCharityForm, setShowCharityForm] = useState(false);
    const [editingCharity, setEditingCharity] = useState(null);
    const [charityForm, setCharityForm] = useState({ name: '', description: '', image: '', website: '', minContribution: 10 });

    const toast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(''), 4000); };

    useEffect(() => { fetchAll(); }, []);

    const fetchAll = async () => {
        try {
            const [aRes, pRes, uRes, cRes, dRes] = await Promise.allSettled([
                axios.get(`${API}/analytics`),
                axios.get(`${API}/prizes`),
                axios.get(`${API}/users`),
                axios.get(`${API}/charities`),
                axios.get(`${API}/draws`),
            ]);
            if (aRes.status === 'fulfilled') setAnalytics(aRes.value.data);
            if (pRes.status === 'fulfilled') setPrizes(pRes.value.data);
            if (uRes.status === 'fulfilled') setUsers(uRes.value.data);
            if (cRes.status === 'fulfilled') setCharities(cRes.value.data);
            if (dRes.status === 'fulfilled') setDraws(dRes.value.data);
        } catch (err) {
            console.error('Fetch admin error', err);
        } finally {
            setLoading(false);
        }
    };

    // ====================== BUSINESS LOGIC ======================

    const runDraw = async () => {
        try {
            toast('Initializing RNG sequence...');
            const res = await axios.post(`${API}/run-draw`, { prizePool: drawPool, drawType });
            toast(`✅ Draw Executed Successfully! Winners: ${res.data.winnersCount}`);
            fetchAll();
        } catch (err) { toast('❌ Operational failure during draw'); }
    };

    const simulateDraw = async () => {
        try {
            const res = await axios.post(`${API}/simulate-draw`, { prizePool: drawPool, drawType });
            setSimResult(res.data);
            toast('📊 Simulation projected');
        } catch (err) { toast('❌ Projection failed'); }
    };

    const publishDraw = async (drawId) => {
        try {
            await axios.patch(`${API}/draw/${drawId}/publish`);
            toast('🌐 Results shared globally');
            fetchAll();
        } catch (err) { toast('❌ Publication error'); }
    };

    const verifyPrize = async (id, status) => {
        try {
            await axios.post(`${API}/verify-prize`, { prizeId: id, status });
            toast(`Status set to: ${status}`);
            fetchAll();
        } catch (err) { toast('❌ Verification update failed'); }
    };

    const [editScoresUser, setEditScoresUser] = useState(null);
    const [scoresForm, setScoresForm] = useState('');

    const startEditScores = (u) => { setEditScoresUser(u._id); setScoresForm(u.scores?.join(', ') || ''); };
    const saveScores = async (id) => {
        try {
            const scores = scoresForm.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
            if (scores.some(s => s < 0 || s > 4)) return toast('⚠️ Points must be 0-4');
            await axios.put(`${API}/user/${id}/scores`, { scores });
            setEditScoresUser(null);
            toast('⛳ Scorecard verified & updated');
            fetchAll();
        } catch (err) { toast('❌ Write error'); }
    };

    const resetCharityForm = () => { setCharityForm({ name: '', description: '', image: '', website: '', minContribution: 10 }); setEditingCharity(null); setShowCharityForm(false); };

    const handleCharitySubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCharity) await axios.put(`${API}/charity/${editingCharity._id}`, charityForm);
            else await axios.post(`${API}/charity`, charityForm);
            resetCharityForm();
            toast('💙 Charity Ecosystem Updated');
            fetchAll();
        } catch (err) { toast('❌ Data structure error'); }
    };

    const handleEditCharity = (c) => {
        setCharityForm({ name: c.name, description: c.description, image: c.image, website: c.website || '', minContribution: c.minContribution });
        setEditingCharity(c);
        setShowCharityForm(true);
    };

    const deleteCharity = async (id) => {
        if (!window.confirm('Purge NGO partner?')) return;
        try { await axios.delete(`${API}/charity/${id}`); toast('🗑️ Entry Purged'); fetchAll(); }
        catch (err) { toast('❌ Referential integrity lock'); }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '15rem', color: 'var(--text-secondary)' }}><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Settings size={40} /></motion.div><p style={{ marginTop: '1rem', letterSpacing: '2px' }}>LOADING PROTOCOLS...</p></div>;

    const navItems = [
        { id: 'analytics', icon: <BarChart3 size={20} />, label: 'Analytics' },
        { id: 'users', icon: <Users size={20} />, label: 'Users' },
        { id: 'draws', icon: <CloudLightning size={20} />, label: 'Draw Engine' },
        { id: 'charities', icon: <Heart size={20} />, label: 'NGO Partners' },
        { id: 'winners', icon: <Award size={20} />, label: 'Winners' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#07090d', color: '#fff' }}>
            {/* Sidebar */}
            <aside style={{ width: '300px', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2.5rem', position: 'sticky', top: 0, height: '100vh', background: 'rgba(255,255,255,0.01)', backdropFilter: 'blur(30px)' }}>
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1rem', padding: '0 0.5rem' }}>
                    <ShieldCheck size={32} color="var(--accent-primary)" />
                    <span style={{ fontSize: '1.5rem', fontWeight: '900', letterSpacing: '-1px' }}>ADMIN<span className="text-gradient">PRO</span></span>
                </Link>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setView(item.id)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '1.25rem',
                                padding: '1.1rem 1.5rem', borderRadius: '15px',
                                background: view === item.id ? 'rgba(0,245,160,0.1)' : 'transparent',
                                color: view === item.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                fontWeight: view === item.id ? '700' : '500',
                                border: 'none', textAlign: 'left', cursor: 'pointer', transition: '0.3s ease'
                            }}
                        >
                            <motion.div animate={view === item.id ? { scale: 1.1 } : { scale: 1 }}>{item.icon}</motion.div>
                            <span style={{ fontSize: '0.95rem' }}>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div style={{ marginTop: 'auto', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--accent-primary)', display: 'grid', placeItems: 'center' }}><ShieldCheck size={20} color="#000" /></div>
                        <div>
                            <p style={{ fontSize: '0.85rem', fontWeight: '800' }}>Vicky Kumar</p>
                            <p style={{ fontSize: '0.65rem', color: 'var(--accent-primary)', textTransform: 'uppercase', fontWeight: '700' }}>Super Admin</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Area */}
            <main style={{ flex: 1, padding: '3.5rem', maxWidth: '1500px', overflowY: 'auto' }}>
                <AnimatePresence mode="wait">
                    {/* View: Analytics (12 KPIs) */}
                    {view === 'analytics' && (
                        <motion.div key="analytics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <div style={{ marginBottom: '3rem' }}>
                                <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '0.5rem' }}>Ecosystem <span className="text-gradient">Pulse</span></h1>
                                <p style={{ color: 'var(--text-secondary)' }}>Live platform metrics and financial health.</p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                                <StatCard color="var(--accent-primary)" icon={<Users />} label="Total Members" value={analytics?.userCount} />
                                <StatCard color="var(--accent-secondary)" icon={<ShieldCheck />} label="Active Subs" value={analytics?.activeSubscriptions} />
                                <StatCard color="#00ffcc" icon={<DollarSign />} label="Gross Revenue" value={`$${analytics?.totalRevenue}`} />
                                <StatCard color="#ffd700" icon={<Trophy />} label="Live Prize Pool" value={`$${analytics?.prizePool}`} />
                                <StatCard color="#ff4d94" icon={<Heart />} label="NGO Pool" value={`$${analytics?.charityPool}`} />
                                <StatCard color="#ffa500" icon={<Award />} label="Global Winners" value={analytics?.totalWinners} />
                                <StatCard color="#ff6b6b" icon={<RefreshCw />} label="Pending Claims" value={analytics?.pendingPrizes} />
                                <StatCard color="#4facfe" icon={<CheckCircle />} label="Verified" value={analytics?.verifiedPrizes} />
                                <StatCard color="#00f2fe" icon={<Send />} label="Payouts Complete" value={analytics?.paidPrizes} />
                                <StatCard color="#a18cd1" icon={<TrendingUp />} label="Avg Activity" value={`${analytics?.avgPoints} pts`} />
                                <StatCard color="#fbc2eb" icon={<CloudLightning />} label="System Draws" value={analytics?.drawsCount} />
                                <StatCard color="#8fd3f4" icon={<Heart />} label="NGO Partners" value={analytics?.charitiesCount} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                                <div className="glass" style={{ padding: '2.5rem', borderRadius: '25px' }}>
                                    <h3 style={{ marginBottom: '2rem', fontWeight: '800' }}>Impact Breakdown</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '15px' }}>
                                            <span style={{ color: 'var(--text-secondary)' }}>Total Paid to Winners</span>
                                            <span style={{ fontWeight: '900', color: 'var(--accent-primary)' }}>${analytics?.totalPaidOut || 0}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '15px' }}>
                                            <span style={{ color: 'var(--text-secondary)' }}>Yearly Contract Users</span>
                                            <span style={{ fontWeight: '900' }}>{analytics?.yearlyUsers || 0} Members</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="glass" style={{ padding: '2.5rem', borderRadius: '25px' }}>
                                    <h3 style={{ marginBottom: '2rem', fontWeight: '800' }}>Charity Support</h3>
                                    {analytics?.charityContributionBreakdown?.map((c, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                            <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>{c.name}</span>
                                            <span style={{ fontWeight: '800', color: 'var(--accent-primary)' }}>${c.totalContribution}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* View: User Governance (Stableford 0-4 Pts) */}
                    {view === 'users' && (
                        <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                                <div>
                                    <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '0.5rem' }}>User <span className="text-gradient">Ecosystem</span></h1>
                                    <p style={{ color: 'var(--text-secondary)' }}>Manage {users.length} member profiles and scorecard activity.</p>
                                </div>
                                <div className="glass" style={{ padding: '0.75rem 1.75rem', fontWeight: '700' }}>Data Core Online</div>
                            </div>

                            <div className="glass" style={{ overflow: 'hidden', borderRadius: '20px' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.85rem', borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)' }}>
                                            <th style={{ padding: '1.5rem' }}>MEMBER</th>
                                            <th style={{ padding: '1.5rem' }}>STATUS</th>
                                            <th style={{ padding: '1.5rem' }}>STABLEFORD scorecard (0-4 Pts)</th>
                                            <th style={{ padding: '1.5rem' }}>ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(u => (
                                            <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                                <td style={{ padding: '1.5rem' }}>
                                                    <p style={{ fontWeight: '800' }}>{u.username}</p>
                                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{u.email} <span style={{ color: 'var(--accent-secondary)', fontSize: '0.7rem' }}>• {u.role.toUpperCase()}</span></p>
                                                </td>
                                                <td style={{ padding: '1.5rem' }}>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: '900', padding: '0.3rem 0.8rem', borderRadius: '30px', background: u.subscriptionStatus === 'active' ? 'rgba(0,245,160,0.1)' : 'rgba(255,255,255,0.05)', color: u.subscriptionStatus === 'active' ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>{u.subscriptionStatus?.toUpperCase()}</span>
                                                </td>
                                                <td style={{ padding: '1.5rem' }}>
                                                    {editScoresUser === u._id ? (
                                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                            <input className="input-field" autoFocus value={scoresForm} onChange={e => setScoresForm(e.target.value)} style={{ width: '130px', padding: '0.5rem' }} placeholder="2,3,2,1,4" />
                                                            <button onClick={() => saveScores(u._id)} className="btn-primary" style={{ padding: '0.5rem' }}><Save size={18} /></button>
                                                        </div>
                                                    ) : (
                                                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                                                            {u.scores?.map((s, i) => (
                                                                <span key={i} style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', display: 'grid', placeItems: 'center', fontSize: '0.85rem', fontWeight: '900', color: s >= 2 ? 'var(--accent-primary)' : '#fff' }}>{s}</span>
                                                            ))}
                                                            <button onClick={() => startEditScores(u)} style={{ background: 'none', color: 'var(--accent-secondary)', cursor: 'pointer', marginLeft: '0.5rem' }}><Edit3 size={16} /></button>
                                                        </div>
                                                    )}
                                                </td>
                                                <td style={{ padding: '1.5rem' }}>
                                                    <Eye size={20} color="var(--text-secondary)" style={{ cursor: 'pointer', opacity: 0.5 }} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {view === 'draws' && (
                        <motion.div key="draws" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '3rem' }}>Draw <span className="text-gradient">Engine</span></h1>
                            <div className="glass" style={{ padding: '3.5rem', borderRadius: '25px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3.5rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Execution Logic</label>
                                    <select className="input-field" style={{ marginTop: '1rem', padding: '1.25rem' }} value={drawType} onChange={e => setDrawType(e.target.value)}>
                                        <option value="random">Pseudo-Random RNG (Fair Distributed)</option>
                                        <option value="algorithm">Weighted Frequency Algorithm (Smart Filter)</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', justifyContent: 'flex-end' }}>
                                    <button onClick={simulateDraw} className="glass" style={{ padding: '1.25rem 2rem', fontWeight: '800', color: 'var(--accent-secondary)' }}>PROJECTION SIMULATION</button>
                                    <button onClick={runDraw} className="btn-primary" style={{ padding: '1.25rem 2rem', fontSize: '1.1rem', fontWeight: '900' }}>RUN LIVE CLOUD DRAW</button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Winners and Charities sections follow this logic code... */}
                    {view === 'winners' && (
                         <motion.div key="winners" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                             <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '3rem' }}>Verification <span className="text-gradient">Center</span></h1>
                             <div className="glass" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                                 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                     <thead>
                                         <tr style={{ textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.85rem', borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)' }}>
                                             <th style={{ padding: '1.5rem' }}>MEMBER</th>
                                             <th style={{ padding: '1.5rem' }}>PRIZE AMOUNT</th>
                                             <th style={{ padding: '1.5rem' }}>ASSET PROOF</th>
                                             <th style={{ padding: '1.5rem' }}>VERIFICATION</th>
                                         </tr>
                                     </thead>
                                     <tbody>
                                         {prizes.map(p => (
                                             <tr key={p._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                                 <td style={{ padding: '1.5rem' }}>
                                                     <p style={{ fontWeight: '800' }}>{p.userId?.username}</p>
                                                     <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{p.matchCategory}</p>
                                                 </td>
                                                 <td style={{ padding: '1.5rem', fontWeight: '900', fontSize: '1.1rem', color: 'var(--accent-primary)' }}>${p.prizeAmount}</td>
                                                 <td style={{ padding: '1.5rem' }}>
                                                     {p.proofScreenshot ? <a href={p.proofScreenshot} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-secondary)', fontSize: '0.85rem', fontWeight: '700' }}>Open Proof ↗</a> : '—'}
                                                 </td>
                                                 <td style={{ padding: '1.5rem' }}>
                                                     <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                         {p.status === 'Pending' && (
                                                             <>
                                                                 <button onClick={() => verifyPrize(p._id, 'Verified')} className="glass" style={{ padding: '0.5rem 1rem', color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: '800' }}>VERIFY</button>
                                                                 <button onClick={() => verifyPrize(p._id, 'Rejected')} className="glass" style={{ padding: '0.5rem 1rem', color: '#ff4d4d', fontSize: '0.75rem', fontWeight: '800' }}>REJECT</button>
                                                             </>
                                                         )}
                                                         {p.status === 'Verified' && <button onClick={() => verifyPrize(p._id, 'Paid')} className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.75rem' }}>INITIATE PAYOUT</button>}
                                                         {p.status === 'Paid' && <span style={{ color: 'var(--accent-primary)', fontWeight: '900', fontSize: '0.8rem' }}>ASSET DISTRIBUTED</span>}
                                                     </div>
                                                 </td>
                                             </tr>
                                         ))}
                                     </tbody>
                                 </table>
                             </div>
                         </motion.div>
                    )}

                    {view === 'charities' && (
                         <motion.div key="charities" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                                 <h1 style={{ fontSize: '2.5rem', fontWeight: '900' }}>NGO <span className="text-gradient">Partners</span></h1>
                                 <button onClick={() => setShowCharityForm(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem' }}><Plus size={20} /> Add Partner</button>
                             </div>

                             {showCharityForm && (
                                 <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass" style={{ padding: '3rem', borderRadius: '25px', marginBottom: '3rem' }}>
                                     <h3 style={{ marginBottom: '2rem', fontWeight: '800' }}>Partner Registration</h3>
                                     <form onSubmit={handleCharitySubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                         <input className="input-field" placeholder="NGO Official Name" value={charityForm.name} onChange={e => setCharityForm({...charityForm, name: e.target.value})} required />
                                         <input className="input-field" placeholder="Official Website" value={charityForm.website} onChange={e => setCharityForm({...charityForm, website: e.target.value})} />
                                         <input className="input-field" style={{ gridColumn: 'span 2' }} placeholder="Vision/Mission statement" value={charityForm.description} onChange={e => setCharityForm({...charityForm, description: e.target.value})} required />
                                         <input className="input-field" placeholder="Branding URL (Logo)" value={charityForm.image} onChange={e => setCharityForm({...charityForm, image: e.target.value})} required />
                                         <input className="input-field" type="number" placeholder="Min Allocation %" value={charityForm.minContribution} onChange={e => setCharityForm({...charityForm, minContribution: parseInt(e.target.value)})} />
                                         <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                             <button type="submit" className="btn-primary" style={{ padding: '1rem 3rem' }}>SAVE ENTRY</button>
                                             <button type="button" onClick={resetCharityForm} className="glass" style={{ padding: '1rem 3rem' }}>CANCEL</button>
                                         </div>
                                     </form>
                                 </motion.div>
                             )}

                             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                                 {charities.map(c => (
                                     <motion.div whileHover={{ y: -5 }} key={c._id} className="glass" style={{ borderRadius: '25px', overflow: 'hidden' }}>
                                         <img src={c.image} alt={c.name} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                                         <div style={{ padding: '2rem' }}>
                                             <h4 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.75rem' }}>{c.name}</h4>
                                             <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', height: '60px', overflow: 'hidden' }}>{c.description}</p>
                                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                                                 <div style={{ display: 'flex', gap: '0.75rem' }}>
                                                     <button onClick={() => handleEditCharity(c)} style={{ background: 'none', border: 'none', color: 'var(--accent-secondary)' }}><Edit3 size={18} /></button>
                                                     <button onClick={() => deleteCharity(c._id)} style={{ background: 'none', border: 'none', color: '#ff4d4d' }}><Trash2 size={18} /></button>
                                                 </div>
                                                 <a href={c.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', fontWeight: '900', fontSize: '0.75rem', textDecoration: 'none' }}>SITE ↗</a>
                                             </div>
                                         </div>
                                     </motion.div>
                                 ))}
                             </div>
                         </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

const StatCard = ({ color, icon, label, value }) => (
    <motion.div 
        whileHover={{ y: -5, background: 'rgba(255,255,255,0.03)' }}
        className="glass" 
        style={{ padding: '2rem', borderTop: `4px solid ${color}`, borderRadius: '24px', position: 'relative', overflow: 'hidden' }}
    >
        <div style={{ color, marginBottom: '1rem', opacity: 0.6 }}>{React.cloneElement(icon, { size: 28 })}</div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '1px' }}>{label}</p>
        <h3 style={{ fontSize: '2rem', fontWeight: '900', marginTop: '0.5rem' }}>{value ?? '--'}</h3>
        <div style={{ position: 'absolute', top: '-15px', right: '-15px', width: '60px', height: '60px', background: color, filter: 'blur(45px)', opacity: 0.08 }}></div>
    </motion.div>
);

export default AdminPanel;
