const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

// Test Model
const TestProfessor = require('../../Mongo/TestProfessors');
const Professor = require('../../Mongo/Professors');

// @route   GET api/items
// @desc    Get all items
// @access  Public
router.get('/', async(req,res) => {
    try{
        const count = await Professor.estimatedDocumentCount().exec();
        if (count == 0) throw new Error(`${count} documents reported in collection`);

        Professor.find().exec()
            .then(professors => {
                res.status(200);
                res.json(professors);
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
        const professor = await Professor.findById(id).exec();
        
        if(!professor) throw new Error(`Document with _id: ${id} could not be found`);
        res.status(200)
        res.json(professor);
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
    const professor = new Professor({ name, email, department });
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
        const updated_professor = await Professor.findByIdAndUpdate(id, {name, department, email}, {new: true});
        
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
        const deletedProfessor = await Professor.findOneAndDelete({_id: id});
        if(!deletedProfessor) throw new Error(`Document with _id: ${id} could not be found`);
        
        const count = await Professor.estimatedDocumentCount().exec();
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