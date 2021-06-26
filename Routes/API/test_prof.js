const express = require('express');
const Professor = require('../../Mongo/TestProfessors');
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


// @route GET /test/:id
// @desc Get item using id
// @access Public

router.get('/:id', (req,res) => {
    id = req.params.id;
    TestProfessor.findOne({_id: id})
        .then(testprofessor => {
            res.status(205)
            res.json(testprofessor);
        })
})

router.post('/create', async (req, res) => {
    const { name, department } = req.body;
    const professor = new TestProfessor({ name, department });
    const ret = await professor.save();
    res.status(201);
    res.json(ret);
});

module.exports = router;