const express = require('express');
const router = express.Router();
const Charity = require('../models/Charity');


console.log("✅ Charity Route Loaded");

// Get all charities with search/filter
router.get('/', async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        if (search) {
            query = { name: { $regex: search, $options: 'i' } };
        }
        const charities = await Charity.find(query);
        res.json(charities);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single charity details
router.get('/:id', async (req, res) => {
    try {
        const charity = await Charity.findById(req.params.id);
        if (!charity) return res.status(404).json({ message: 'Charity not found' });
        res.json(charity);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
