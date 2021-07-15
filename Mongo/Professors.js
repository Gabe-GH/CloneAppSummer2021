const { model , Schema } = require('mongoose');

const classSchema = new Schema({
    classDepartment: {
        type: String, 
        default: 'CSCI',
        trim: true
    },
    classSection: {
        type: Number,
        default: 1000,
        min: 1000,
        max: 9999
    }
})

const commentSchema = new Schema(
    {
        commentQuality: {
            type: Number,
            default: 0.0,
            min: 0.0,
            max: 5.0
        },
        commentDifficulty: {
            type: Number,
            default: 0.0,
            min: 0.0,
            max: 5.0

        },
        commentClass: classSchema,
        commentDate: {
            type: Date,
            default: Date.now
        }
    }
)

const professorSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        department: {
            type: String,
            required: true,
            trim: true
        },
        overall: {
            type: Number,
            default: 0.0,
            min: 0.0,
            max: 5.0
        },
        difficulty: {
            type: Number,
            default: 0.0,
            min: 0.0,
            max: 5.0
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
            default: 'Insert bio here',
            trim: true
        }
    },
    { 
        minimize: false,
        strict: true,
        strictQuery: true
    }
);

module.exports = Professor = model('Professor', professorSchema, 'professors');