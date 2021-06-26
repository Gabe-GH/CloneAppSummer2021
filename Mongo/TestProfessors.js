const { ObjectId } = require('mongodb');
const { ObjectID } = require('mongodb');
const { Decimal128 } = require('mongodb');
const { model , Schema } = require('mongoose');

const classSchema = new Schema({
    classDepartment: {
        type: String, 
        default: 'CSCI'
    },
    classSection: {
        type: Number,
        default: 1000
    }
})

const commentSchema = new Schema(
    {
        commentQuality: {
            type: Number,
            default: 0.0
        },
        commentDifficulty: {
            type: Number,
            default: 0.0
        },
        commentClass: classSchema,
        commentDate: {
            type: Date,
            default: Date.now
        }
    }
)

const testprofessorSchema = new Schema(
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
            default: 0.0
        },
        difficulty: {
            type: Number,
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
            type: String,
            default: 'Insert bio here'
        }

    }
);

module.exports = TestProfessor = model('TestProfessor', testprofessorSchema, 'professors_test');