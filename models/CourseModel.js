const mongoose = require('mongoose');
const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'please enter a title',]
    },
    description: {
        type: String,
        required: [true, 'please enter a description',]
    },
    weeks: {
        type: String,
        required: [true, 'Please add a Number of weeks']
    },
    tuition: {
        type: Number,
        required: [true, 'Please add a tution']
    },
    minimumSkill: {
        type: String,
        required: [true, "Please add a minimum skill"],
        enum: ["beginner","intermediate","advanced"]
    },
    ScholarshipAvailable: {
        type: String,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId, // this means this will be the foregin key
        ref: 'Bootcamp',
        required: true

    }


});
module.exports = mongoose.model('Course', CourseSchema);