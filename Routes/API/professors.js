const express = require('express');
const Professors = require('../../Mongo/Professors');
const router = express.Router();

// Professor Model
const Professor = require('../../Mongo/Professors');

// @route   GET api/items
// @desc    Get all items
// @access  Public
router.get('/', (req, res) => {
    Professor.find()
        .then(professors => {
            res.json(professors)
        })
});

module.exports = router;