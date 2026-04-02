import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, ShieldCheck } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/auth/login', { email, password });
            login(res.data.token, res.data.user);
            
            // Redirect based on role
            if (res.data.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '2rem' }}>
            <div style={{ width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Login Card */}
                <div className="glass animate-fade-in" style={{ padding: 'clamp(1.5rem, 5vw, 3.5rem)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <LogIn size={48} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
                        <h2 style={{ fontSize: 'var(--fs-h2)', fontWeight: '800' }}>Member Login</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Login to manage your scores & draws.</p>
                    </div>

                    {error && <p style={{ color: '#ff4d4d', textAlign: 'center', marginBottom: '1.5rem', background: 'rgba(255,77,77,0.1)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem' }}>{error}</p>}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '1rem', color: 'var(--text-secondary)' }} />
                            <input 
                                type="email" 
                                className="input-field" 
                                placeholder="Email Address" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                style={{ paddingLeft: '3rem' }}
                                required 
                            />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '1rem', color: 'var(--text-secondary)' }} />
                            <input 
                                type="password" 
                                className="input-field" 
                                placeholder="Password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                style={{ paddingLeft: '3rem' }}
                                required 
                            />
                        </div>
                        <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>Login to Dashboard</button>
                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                            Don't have an account? <Link to="/signup" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: '600' }}>Create Account</Link>
                        </p>
                    </form>
                </div>

                {/* Admin Portal Link */}
                <div style={{ textAlign: 'center' }}>
                    <Link to="/admin-login" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.75rem', opacity: 0.6, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        <ShieldCheck size={14} /> Administrator Portal Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
