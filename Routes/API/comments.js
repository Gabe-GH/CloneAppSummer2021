const express = require('express');
const router = express.Router();

// Comment Model
const Comment = require('../../Mongo/Comments');

// @route   GET api/items
// @desc    Get all items
// @access  Public
router.get('/', (req, res) => {
    Comment.find()
        .then(comments => {
            res.json(comments)
        })
});

module.exports = router;