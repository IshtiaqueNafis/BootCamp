const mongoose = require('mongoose'); // is for coonecting to database
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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


// encropt password using bcrypt
UserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10); // create salt with the base of 10
    this.password = await bcrypt.hash(this.password, salt); // created hash password

});
//Match User Entered password to hash password
UserSchema.methods.matchPassword = function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};


// sign JWT and return
UserSchema.methods.getSingedJWTTOKEN = function () {
    // means object created from the schema will be able to use this class.
    return jwt.sign({id: this._id}, process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE
        }
    );
}
module.exports = mongoose.model('User', UserSchema)