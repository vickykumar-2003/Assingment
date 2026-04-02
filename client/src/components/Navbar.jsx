import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Trophy, LogOut, LayoutDashboard, Heart, Award, ShieldAlert, LogIn, UserPlus, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Navbar = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        navigate('/');
    };

    return (
        <motion.nav 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, cubicBezier: [0.16, 1, 0.3, 1] }}
            className="glass" 
            style={{ 
                margin: '1rem', 
                padding: '0.75rem 1.5rem', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                position: 'sticky', 
                top: '1rem', 
                zIndex: 1000,
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
            }}
        >
            {/* Logo Section */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'inherit' }}>
                <motion.div whileHover={{ rotate: 10, scale: 1.1 }}>
                    <Trophy size={32} color="var(--accent-primary)" />
                </motion.div>
                <span style={{ fontSize: '1.5rem', fontWeight: '900', letterSpacing: '-0.75px' }}>
                    Golf<span className="text-gradient">Charity</span>
                </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hide-mobile" style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
                <NavLink to="/charities" className="nav-link">
                    <Heart size={18} /> <span>Charities</span>
                </NavLink>

                {user ? (
                    <>
                        <NavLink to="/dashboard" className="nav-link">
                            <LayoutDashboard size={18} /> <span>Dashboard</span>
                        </NavLink>
                        <NavLink to="/leaderboard" className="nav-link">
                            <Award size={18} /> <span>Leaderboard</span>
                        </NavLink>
                        {user.role === 'admin' && (
                            <NavLink to="/admin" className="nav-link" style={{ color: 'var(--accent-secondary)' }}>
                                <ShieldAlert size={18} /> <span>Admin Panel</span>
                            </NavLink>
                        )}
                    </>
                ) : (
                    <NavLink to="/admin-login" className="nav-link">
                        <ShieldAlert size={18} /> <span>Admin Portal</span>
                    </NavLink>
                )}
            </div>

            {/* Auth Actions (Desktop) */}
            <div className="hide-mobile" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                {user ? (
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLogout} 
                            className="btn-primary"
                            style={{ 
                                background: 'rgba(255, 77, 77, 0.1)', 
                                color: '#ff4d4d', 
                                border: '1px solid rgba(255, 77, 77, 0.2)',
                                padding: '0.6rem 1.2rem',
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <LogOut size={18} /> Logout
                        </motion.button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                        <Link to="/login" style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: '600' }}>Login</Link>
                        <Link to="/signup" className="btn-primary" style={{ textDecoration: 'none' }}>Join Now</Link>
                    </div>
                )}
            </div>

            {/* Mobile Toggle */}
            <div className="sm-hidden" style={{ display: 'none' }}>
                <style>{`
                    @media (max-width: 768px) {
                        .sm-hidden { display: block !important; }
                        .hide-mobile { display: none !important; }
                    }
                `}</style>
                <button 
                    onClick={() => setIsOpen(!isOpen)} 
                    style={{ background: 'none', color: 'white', padding: '0.5rem' }}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Drawer */}
            <motion.div
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                style={{ 
                    position: 'absolute', 
                    top: '100%', 
                    left: 0, 
                    right: 0, 
                    overflow: 'hidden', 
                    background: 'rgba(10, 12, 16, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderBottomRadius: '20px',
                    border: '1px solid var(--glass-border)',
                    borderTop: 'none',
                    marginTop: '0.5rem',
                    borderRadius: '0 0 20px 20px'
                }}
            >
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <NavLink to="/charities" className="nav-link" onClick={() => setIsOpen(false)}>
                        <Heart size={18} /> Charities
                    </NavLink>
                    {user ? (
                        <>
                            <NavLink to="/dashboard" className="nav-link" onClick={() => setIsOpen(false)}>
                                <LayoutDashboard size={18} /> Dashboard
                            </NavLink>
                            <NavLink to="/leaderboard" className="nav-link" onClick={() => setIsOpen(false)}>
                                <Award size={18} /> Leaderboard
                            </NavLink>
                            {user.role === 'admin' && (
                                <NavLink to="/admin" className="nav-link" onClick={() => setIsOpen(false)}>
                                    <ShieldAlert size={18} /> Admin Panel
                                </NavLink>
                            )}
                            <button onClick={handleLogout} style={{ width: '100%', padding: '1rem', background: 'rgba(255, 77, 77, 0.1)', color: '#ff4d4d', borderRadius: '12px', textAlign: 'left', fontWeight: '700' }}>
                                <LogOut size={18} style={{ marginRight: '0.5rem' }} /> Logout
                            </button>
                        </>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <Link to="/login" onClick={() => setIsOpen(false)} style={{ padding: '1rem', color: 'white', textDecoration: 'none' }}>Login</Link>
                            <Link to="/signup" className="btn-primary" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none', textAlign: 'center' }}>Join Now</Link>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.nav>
    );
};

export default Navbar;
