const { model, Schema, createConnection } = require('mongoose');


const commentSchema = new Schema(
    {
        name: String,
        email: String,
        movie_id: String,
        text: String,
        date: String
    },
    { timestamps: true },
);



module.exports = Comment = model('Comment', commentSchema, 'comments')