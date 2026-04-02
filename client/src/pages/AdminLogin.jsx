import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, ShieldCheck, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/auth/login', { email, password });
            
            // Strict Role Check for Admin Login
            if (res.data.user.role !== 'admin') {
                setError('Unauthorized. This portal is for administrators only.');
                return;
            }

            login(res.data.token, res.data.user);
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '100vh', 
            padding: '2rem',
            background: 'radial-gradient(circle at 10% 20%, rgba(139, 92, 246, 0.05) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(0, 245, 160, 0.03) 0%, transparent 40%)'
        }}>
            <div style={{ width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem', width: 'fit-content' }}>
                    <ChevronLeft size={16} /> User Login
                </Link>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="glass" 
                    style={{ padding: '3.5rem', border: '1px solid rgba(139, 92, 246, 0.3)', boxShadow: '0 0 40px rgba(139, 92, 246, 0.1)' }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <div style={{ 
                            width: '80px', 
                            height: '80px', 
                            borderRadius: '20px', 
                            background: 'rgba(139, 92, 246, 0.1)', 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            margin: '0 auto 1.5rem',
                            border: '1px solid rgba(139, 92, 246, 0.2)'
                        }}>
                            <ShieldCheck size={40} color="#8b5cf6" />
                        </div>
                        <h2 style={{ fontSize: '2.2rem', fontWeight: '800', letterSpacing: '-1px' }}>Admin Portal</h2>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Secure access for system administrators.</p>
                    </div>

                    {error && (
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }}
                            style={{ 
                                padding: '1rem', 
                                background: 'rgba(255, 77, 77, 0.1)', 
                                border: '1px solid #ff4d4d', 
                                color: '#ff4d4d', 
                                borderRadius: '10px', 
                                marginBottom: '2rem',
                                fontSize: '0.85rem',
                                textAlign: 'center'
                            }}
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '1.25rem', top: '1.1rem', color: 'var(--text-secondary)' }} />
                            <input 
                                type="email" 
                                className="input-field" 
                                placeholder="Admin Email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                style={{ paddingLeft: '3.5rem', height: '3.5rem' }}
                                required 
                            />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '1.25rem', top: '1.1rem', color: 'var(--text-secondary)' }} />
                            <input 
                                type="password" 
                                className="input-field" 
                                placeholder="Security Password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                style={{ paddingLeft: '3.5rem', height: '3.5rem' }}
                                required 
                            />
                        </div>
                        <button type="submit" className="btn-primary" style={{ marginTop: '1rem', height: '3.5rem', fontSize: '1rem', background: '#8b5cf6' }}>
                            Authenticate Access
                        </button>
                    </form>

                    <div style={{ marginTop: '2.5rem', textAlign: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                            Unauthorized access attempts are logged.<br/>
                            Contact system head for credential issues.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminLogin;
