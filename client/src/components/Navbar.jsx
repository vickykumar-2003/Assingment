import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Trophy, LogOut, LayoutDashboard, Heart, Award, ShieldAlert, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <motion.nav 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, cubicBezier: [0.16, 1, 0.3, 1] }}
            className="glass" 
            style={{ 
                margin: '1.5rem', 
                padding: '0.75rem 2.5rem', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                position: 'sticky', 
                top: '1.5rem', 
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

            {/* Navigation Links */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
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
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <Link to="/admin-login" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textDecoration: 'none', opacity: 0.7 }}>
                            Admin Portal
                        </Link>
                    </div>
                )}
            </div>

            {/* Auth Actions */}
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                {user ? (
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <div style={{ textAlign: 'right', display: 'none', sm: 'block' }}>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Logged in as</p>
                            <p style={{ fontSize: '0.85rem', fontWeight: '800' }}>{user.username}</p>
                        </div>
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLogout} 
                            style={{ 
                                background: 'rgba(255, 77, 77, 0.1)', 
                                color: '#ff4d4d', 
                                border: '1px solid rgba(255, 77, 77, 0.2)',
                                borderRadius: '10px',
                                padding: '0.6rem 1.2rem',
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '0.5rem',
                                fontWeight: '700',
                                fontSize: '0.9rem'
                            }}
                        >
                            <LogOut size={18} /> Logout
                        </motion.button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                        <Link to="/login" style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <LogIn size={18} color="var(--text-secondary)" /> Login
                        </Link>
                        <Link to="/signup" className="btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <UserPlus size={18} /> Join Now
                        </Link>
                    </div>
                )}
            </div>
        </motion.nav>
    );
};

export default Navbar;
