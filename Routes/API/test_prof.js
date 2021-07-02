const express = require('express');
//const Professor = require('../../Mongo/TestProfessors');
const router = express.Router();
const mongoose = require("mongoose");

// Test Model
const TestProfessor = require('../../Mongo/TestProfessors');

// @route   GET api/items
// @desc    Get all items
// @access  Public
router.get('/', async (req, res) => {
    const count = await TestProfessor.estimatedDocumentCount().exec();

    if(count){
        TestProfessor.find()
            .exec()
            .then(testprofessors => {
                res.status(202);
                res.json(testprofessors)
            })
    }
    else{
        res.status(404);
        res.json({
            "message": `The collection is reporting empty!`,
            "count": count
        })
    }
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

// @route POST /
// @desc Creates a new document and saves it to the db
// @access Public
router.post('/', async (req, res) => {
    const { name, department } = req.body;
    const professor = new TestProfessor({ name, department });
    try {
        const ret = await professor.save();
        res.status(201);
        res.json(ret);
    } catch(e) {
        res.status(506);
        res.json({"error": e});
    };
});

// @route POST /:id
// @desc Updates a document and saves it to the db
// @access Public
router.post('/:id', async (req,res) => {
    const id = req.params.id;
    const { name, department } = req.body;
    const updated_professor = await TestProfessor.findByIdAndUpdate(id, {name, department}, {new: true})
    res.status(205);
    res.json(updated_professor);
});

// @route DELETE /:id
// @desc Removes a document from the db
// @access Public
router.delete('/:id', async(req,res) => {
    const id = req.params.id;
    const deletedProfessor = await TestProfessor.findOneAndDelete({_id: id})
    const count = await TestProfessor.estimatedDocumentCount().exec();
    console.log(count);
    res.status(202);
    res.json({
        "message": "document deleted",
        "_id": deletedProfessor._id,
        "name": deletedProfessor.name,
        "count": count
    });
});

module.exports = router;