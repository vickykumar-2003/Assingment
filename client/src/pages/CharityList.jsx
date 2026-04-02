import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart, Globe, Search, ArrowRight, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API = '/api/charity';
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800';

const CharityList = () => {
    const [charities, setCharities] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCharities();
    }, [searchTerm]);

    const fetchCharities = async () => {
        try {
            const res = await axios.get(`${API}?search=${searchTerm}`);
            setCharities(res.data);
        } catch (err) {
            console.error('Fetch charities error', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '6rem 2rem' }}>
            <header style={{ textAlign: 'center', marginBottom: '6rem' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 style={{ fontSize: '4.5rem', fontWeight: '900', marginBottom: '1.5rem', letterSpacing: '-2px', lineHeight: 1 }}>Support <span className="text-gradient">Impactful</span> Causes</h1>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto', fontSize: '1.25rem', lineHeight: 1.6 }}>
                        Explore our vetted charity partners. Every membership contribution fuels these organizations directly. Choose a cause you believe in.
                    </p>
                </motion.div>
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ position: 'relative', maxWidth: '600px', margin: '3rem auto 0' }}
                >
                    <Search size={22} style={{ position: 'absolute', left: '1.5rem', top: '1.25rem', color: 'var(--text-secondary)' }} />
                    <input 
                        type="text" 
                        className="input-field" 
                        placeholder="Search by mission, name, or focus..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ padding: '1.25rem 1.5rem 1.25rem 4rem', fontSize: '1.1rem', borderRadius: '20px' }}
                    />
                </motion.div>
            </header>

            {loading ? (
                <div style={{ display: 'grid', placeItems: 'center', height: '40vh', color: 'var(--text-secondary)' }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Heart size={40} /></motion.div>
                    <p style={{ marginTop: '1rem', letterSpacing: '2px', fontWeight: '700' }}>DISCOVERING CAUSES...</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '3rem' }}>
                    <AnimatePresence>
                        {charities.length > 0 ? charities.map((charity, index) => (
                            <CharityCard key={charity._id} charity={charity} index={index} />
                        )) : (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem', color: 'var(--text-secondary)' }}>
                                <Info size={48} style={{ marginBottom: '1.5rem', opacity: 0.5 }} />
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>No charities match your search.</h3>
                                <p>Try different keywords or browse the full list.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

const CharityCard = ({ charity, index }) => {
    const [imgSrc, setImgSrc] = useState(charity.image || FALLBACK_IMAGE);

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.05 }}
            className="glass glass-hover" 
            style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', borderRadius: '28px' }}
        >
            <div style={{ height: '240px', width: '100%', overflow: 'hidden', position: 'relative' }}>
                <img 
                    src={imgSrc} 
                    alt={charity.name} 
                    onError={() => setImgSrc(FALLBACK_IMAGE)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.5s' }} 
                />
                <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '800', color: 'var(--accent-primary)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    TRUSTED PARTNER
                </div>
            </div>
            <div style={{ padding: '2.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.75rem', fontWeight: '900', marginBottom: '1rem', letterSpacing: '-0.5px' }}>{charity.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '2rem' }}>{charity.description}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '1px' }}>MIN CONTRIBUTION</span>
                        <span style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Heart size={20} fill="currentColor" /> {charity.minContribution}%
                        </span>
                    </div>
                    <a 
                        href={charity.website} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="glass"
                        style={{ textDecoration: 'none', color: '#fff', fontSize: '0.9rem', fontWeight: '700', padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '15px' }}
                    >
                        Foundation Site <ArrowRight size={16} />
                    </a>
                </div>
            </div>
        </motion.div>
    );
};

export default CharityList;
