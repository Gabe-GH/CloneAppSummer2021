const { ObjectId } = require('mongodb');
const { Decimal128 } = require('mongodb');
const { model , Schema } = require('mongoose');

const classSchema = new Schema({
    classDepartment: {
        type: String,
        required: true, 
        default: 'CSCI'
    },
    classSection: {
        type: Number,
        required: true,
        default: 1000
    }
})

const commentSchema = new Schema(
    {
        commentQuality: {
            type: Number,
            required: true,
            default: 0.0
        },
        commentDifficulty: {
            type: Number,
            required: true,
            default: 0.0
        },
        commentClass: classSchema,
        commentDate: {
            type: Date,
            required: true,
            default: Date.now
        }
    }
)

const professorSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        department: {
            type: String,
            required: true
        },
        overall: {
            type: Number,
            required: true,
            default: 0.0
        },
        difficulty: {
            type: Number,
            required: true,
            default: 0.0
        },
        classes: {
            type: [classSchema],
            default: undefined
        },
        comments: {
            type: [commentSchema],
            default: undefined
        },
        bio: {
            type: String
        }

    },
    { timestamps: true}
);

module.exports = Professor = model('Professor', professorSchema, 'professors');