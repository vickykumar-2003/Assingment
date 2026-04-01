import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, ShieldCheck, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ padding: '4rem 2rem', textAlign: 'center', maxWidth: '1200px', margin: '0 auto' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span className="glass" style={{ padding: '0.5rem 1.5rem', borderRadius: '100px', fontSize: '0.875rem', color: 'var(--accent-primary)', marginBottom: '2rem', display: 'inline-block' }}>
          NEW: Monthly Draw is now Live! ⛳️
        </span>
        <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: '800', lineHeight: '1.1', marginBottom: '1.5rem' }}>
          Play Golf. <br />
          <span className="text-gradient">Support Causes.</span> <br />
          Win Together.
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto 3rem', lineHeight: '1.6' }}>
          Join the exclusive Golf Charity Subscription Platform. Manage your scores, support your favorite charities, and enter monthly draws with massive prize pools.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginBottom: '6rem' }}>
          <Link to="/signup" className="btn-primary" style={{ textDecoration: 'none', padding: '1.25rem 2.5rem' }}>
            Get Started Now <ArrowRight size={20} style={{ marginLeft: '10px', verticalAlign: 'middle' }} />
          </Link>
          <Link to="/charities" className="glass glass-hover" style={{ textDecoration: 'none', padding: '1.25rem 2.5rem', fontWeight: '600' }}>
            Explore Charities
          </Link>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginTop: '4rem' }}>
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
