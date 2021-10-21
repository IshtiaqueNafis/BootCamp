const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, `Please add a Title for the review`],
        maxlength: 100,
    },
    text: {
        type: String,
        required: [true, 'Please add review for your text']
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true, `please add a rating between 1 and 10 `]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true

    }

});
//prevents user from submiting more than one review for bootcamp.
ReviewSchema.index({bootcamp: 1, user: 1}, {unique: true});
              // this means only 1 review is allowed from each user for each bootcamp.
module.exports = mongoose.model('Review', ReviewSchema);