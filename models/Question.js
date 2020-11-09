const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    question: {
        type: Object,
        required: true,
        unique: true
    },
    answer: {
        type: Number,
        required: true,
        trim: true
    },
    createDate: {
        type: Date,
        required: true,
        default: new Date()
    }
});


module.exports = mongoose.model('questions', QuestionSchema);