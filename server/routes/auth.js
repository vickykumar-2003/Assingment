const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendWelcomeEmail } = require('../utils/emailService');
const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password, role, charityId } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const user = new User({
            username,
            email,
            password,
            role: role || 'user',
            currentCharity: charityId
        });

        await user.save();

        // Send Welcome Email (Non-blocking)
        sendWelcomeEmail(email, username);

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        res.status(201).json({ token, user: { id: user._id, username, email, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, username: user.username, email, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
