const express = require('express');
//const Professor = require('../../Mongo/TestProfessors');
const router = express.Router();
const mongoose = require("mongoose");
const { count } = require('../../Mongo/TestProfessors');
const TestProfessors = require('../../Mongo/TestProfessors');

// Test Model
const TestProfessor = require('../../Mongo/TestProfessors');

// @route   GET api/items
// @desc    Get all items
// @access  Public
router.get('/', async(req,res) => {
    try{
        const count = await TestProfessor.estimatedDocumentCount().exec();
        if (count == 0) throw new Error(`${count} documents reported in collection`);

        TestProfessor.find().exec()
            .then(testprofessors => {
                res.status(200);
                res.json(testprofessors);
            });
    } catch(e) {
        res.status(404);
        res.json({ "Error": e.message });
    }
})


// @route GET /test/:id
// @desc Get item using id
// @access Public
router.get('/:id', async(req,res) => {
    const id = req.params.id;
    try{
        const testProfessor = await TestProfessor.findById(id).exec();
        
        if(!testProfessor) throw new Error(`Document with _id: ${id} could not be found`);
        res.status(200)
        res.json(testProfessor);
    } catch(e) {
        res.status(404);
        res.json({"Error": e.message}); 
    };
});

// @route POST /
// @desc Creates a new document and saves it to the db
// @access Public
router.post('/', async (req, res) => {
    const { name, email, department } = req.body;
    const professor = new TestProfessor({ name, email, department });
    try {
        const ret = await professor.save();
        res.status(201);
        res.json(ret);
    } catch(e) {
        res.status(400);
        res.json(e);
    };
});

// @route POST /:id
// @desc Updates a document and saves it to the db
// @access Public
router.post('/:id', async (req,res) => {
    const id = req.params.id;
    const { name, email, department } = req.body;
    try{
        const updated_professor = await TestProfessor.findByIdAndUpdate(id, {name, department, email}, {new: true});
        
        if (!updated_professor) throw new Error(`Document with _id: ${id} could not be found`);
        
        res.status(201);
        res.json(updated_professor);
    }catch(e) {
        res.status(404);
        res.json({"Error": e.message});
    }
});

// @route DELETE /:id
// @desc Removes a document from the db
// @access Public
router.delete('/:id', async(req,res) => {
    const id = req.params.id;
    try {
        const deletedProfessor = await TestProfessor.findOneAndDelete({_id: id});
        if(!deletedProfessor) throw new Error(`Document with _id: ${id} could not be found`);
        
        const count = await TestProfessor.estimatedDocumentCount().exec();
        res.status(202);
        res.json({
            "message": "document deleted",
            "_id": deletedProfessor._id,
            "name": deletedProfessor.name,
            "count": count
        });
    } catch(e){
        res.status(404);
        res.json({"Error": e.message});
    };
});

module.exports = router;