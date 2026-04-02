/**
 * Backend Entry Point
 * Technology Stack: Express, Mongoose, Node.js
 * Features: Auth, User Management, Charity System, Draw Engine, Payments
 */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const charityRoutes = require('./routes/charity');
const adminRoutes = require('./routes/admin');
const paymentRoutes = require('./routes/payment');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// DB Connection Options
const dbOptions = {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000,
};

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/golf-charity', dbOptions)
.then(() => console.log('✅ MongoDB Connected Ready'))
.catch(err => {
    console.error('❌ MongoDB Connection Error: ', err.message);
    console.log('⚠️ Running in degraded mode: Some features may be unavailable.');
});

// Handle connection lost
mongoose.connection.on('error', err => {
    console.error('🌐 MongoDB Late Error: ', err);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/charity', charityRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('Golf Charity Platform API');
    });
}

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
