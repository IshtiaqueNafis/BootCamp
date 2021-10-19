const mongoose = require('mongoose'); // is for coonecting to database

const UserSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Please add a name ']
    },
    email: {
        type: String,
        required: [true, 'please enter an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'publisher']
    },
    password: {
        type: String,
        required: [true, 'please enter a password'],
        minlength: 6,
        select: false,
    },

    resetPasswordToken: String,
    resetPasswordDate: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }


});
module.exports = mongoose.model('User', UserSchema)