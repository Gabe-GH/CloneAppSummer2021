const express = require('express');
const Professors = require('../../Mongo/TestProfessors');
const router = express.Router();

// Test Model
const TestProfessor = require('../../Mongo/TestProfessors');

// @route   GET api/items
// @desc    Get all items
// @access  Public
router.get('/', (req, res) => {
    TestProfessor.find()
        .then(testprofessors => {
            res.json(testprofessors)
        })
});

module.exports = router;