import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Heart } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', charityId: '' });
    const [charities, setCharities] = useState([]);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCharities();
    }, []);

    const fetchCharities = async () => {
        try {
            const res = await axios.get('/api/charity');
            setCharities(res.data);
            if (res.data.length > 0) setFormData(prev => ({ ...prev, charityId: res.data[0]._id }));
        } catch (err) {
            console.error('Fetch charities error', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/auth/signup', formData);
            login(res.data.token, res.data.user);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '4rem 2rem' }}>
            <div className="glass animate-fade-in" style={{ padding: '3rem', maxWidth: '500px', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <UserPlus size={48} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
                    <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>Join the Club</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Sign up to play, win, and support charities.</p>
                </div>

                {error && <p style={{ color: '#ff4d4d', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ position: 'relative' }}>
                        <User size={18} style={{ position: 'absolute', left: '1rem', top: '1rem', color: 'var(--text-secondary)' }} />
                        <input 
                            type="text" 
                            className="input-field" 
                            placeholder="Username" 
                            value={formData.username} 
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })} 
                            style={{ paddingLeft: '3rem' }}
                            required 
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '1rem', color: 'var(--text-secondary)' }} />
                        <input 
                            type="email" 
                            className="input-field" 
                            placeholder="Email Address" 
                            value={formData.email} 
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
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
                            value={formData.password} 
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                            style={{ paddingLeft: '3rem' }}
                            required 
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Heart size={18} style={{ position: 'absolute', left: '1rem', top: '1rem', color: 'var(--text-secondary)' }} />
                        <select 
                            className="input-field" 
                            value={formData.charityId} 
                            onChange={(e) => setFormData({ ...formData, charityId: e.target.value })} 
                            style={{ 
                                paddingLeft: '3rem', 
                                background: '#1c1f26', 
                                color: 'white' 
                            }}
                            required
                        >
                            <option value="" style={{ background: '#1c1f26' }}>Select a Charity</option>
                            {charities.map(c => (
                                <option key={c._id} value={c._id} style={{ background: '#1c1f26' }}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>Sign Up</button>
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '1rem' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;
