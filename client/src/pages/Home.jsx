import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, ShieldCheck, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', overflow: 'hidden' }}>
      {/* Hero Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center', minHeight: '80vh', padding: '1rem 0' }}>
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, cubicBezier: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: 'left' }}
        >
          <motion.span 
            whileHover={{ scale: 1.05 }}
            className="glass" 
            style={{ padding: '0.6rem 1.5rem', borderRadius: '100px', fontSize: '0.85rem', color: 'var(--accent-primary)', marginBottom: '2.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', border: '1px solid rgba(0, 245, 160, 0.2)' }}
          >
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)', boxShadow: '0 0 10px var(--accent-primary)' }}></div>
            NEW: Monthly Draw is now Live! ⛳️
          </motion.span>
          
          <h1 style={{ fontSize: 'var(--fs-h1)', fontWeight: '900', lineHeight: '1.05', marginBottom: '2rem', letterSpacing: '-2px' }}>
            Play Golf. <br />
            <span className="text-gradient">Support Causes.</span> <br />
            Win Together.
          </h1>
          
          <p style={{ fontSize: 'var(--fs-body)', color: 'var(--text-secondary)', marginBottom: '3rem', lineHeight: '1.7', maxWidth: '600px' }}>
            Join the exclusive Golf Charity platform. Submit your Stableford scores, support vetted global charities, and enter massive monthly prize draws.
          </p>
          
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <Link to="/signup" className="btn-primary" style={{ textDecoration: 'none', padding: '1.25rem 2.5rem', display: 'inline-flex', alignItems: 'center', fontSize: '1.1rem' }}>
              Join the Club <ArrowRight size={20} style={{ marginLeft: '12px' }} />
            </Link>
            <Link to="/charities" className="glass glass-hover" style={{ textDecoration: 'none', padding: '1.25rem 2.5rem', fontWeight: '800', color: 'var(--text-primary)', fontSize: '1.1rem', display: 'inline-flex', alignItems: 'center' }}>
              Explore Charities
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, cubicBezier: [0.16, 1, 0.3, 1] }}
          style={{ position: 'relative' }}
        >
          {/* Neon Glow Background */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '120%', height: '120%', background: 'radial-gradient(circle, rgba(0,245,160,0.15) 0%, rgba(0,0,0,0) 70%)', zIndex: 0, pointerEvents: 'none' }}></div>
          
          <img 
            src="https://images.unsplash.com/photo-1587329310686-91414b8e3cb7?q=80&w=1200" 
            alt="Golf Course Action" 
            style={{ width: '100%', height: 'auto', borderRadius: '32px', position: 'relative', zIndex: 1, border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 30px 60px rgba(0,0,0,0.6)', objectFit: 'cover', aspectRatio: '4/3' }} 
          />
          
          {/* Floating Interactive Badge */}
          <motion.div 
             animate={{ y: [0, -15, 0] }}
             transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
             className="glass glass-hover"
             style={{ position: 'absolute', bottom: '-30px', left: '-30px', zIndex: 2, padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', gap: '1.25rem', border: '1px solid var(--accent-secondary)' }}
          >
             <div style={{ background: 'rgba(0, 217, 255, 0.1)', padding: '1rem', borderRadius: '50%' }}>
                <Trophy size={32} color="var(--accent-secondary)" />
             </div>
             <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800' }}>Current Jackpot</p>
                <p style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-primary)', lineHeight: 1, marginTop: '0.25rem' }}>$24,500</p>
             </div>
          </motion.div>
        </motion.div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '4rem' }}>
        <FeatureCard 
          icon={<Trophy size={40} color="var(--accent-primary)" />} 
          title="Monthly Jackpots" 
          desc="Participate in our monthly draws. 40% goes to the 5-match jackpot!" 
        />
        <FeatureCard 
          icon={<Heart size={40} color="#ff4d94" />} 
          title="Charity First" 
          desc="Every subscription contributes at least 10% to your chosen charity." 
        />
        <FeatureCard 
          icon={<ShieldCheck size={40} color="var(--accent-secondary)" />} 
          title="Verified Winners" 
          desc="Transparent draw system with secure verification and instant payouts." 
        />
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="glass animate-fade-in" 
    style={{ padding: '3rem 2rem', textAlign: 'left' }}
  >
    <div style={{ marginBottom: '1.5rem' }}>{icon}</div>
    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: '700' }}>{title}</h3>
    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>{desc}</p>
  </motion.div>
);

export default Home;
