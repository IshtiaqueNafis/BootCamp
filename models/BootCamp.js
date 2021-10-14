const mongoose = require('mongoose');
const BootCampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name Can not be more than 50 characters']
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Please Add a description'],
        maxlength: [500, 'Description can  not be more than 500 characters']
    },
    website: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Please Use a valid URL with HTTP or HTTPS'

        ]
    },

    email: {
        type: String,
        match: [
            /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            'Please add a valid Email'
        ]
    },
    phone: {
        type: String,
        maxlength: [20, 'Phone number can not be large than 20 Characters']
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    location: {
        name: String,
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point' // means only avialble values
            required: true
        },
        coordinates: {
            type: [Number],
            required: true,
            index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String

    },
    careers: {
        type: [String], //means it will be an array,
        required: true,
        enum: [
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Other'
        ]

    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must be 1'],
        max: [10, 'Rating Can not be Higher than 10']
    },
    averageCost: Number,
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    housing: {
        type: Boolean,
        default: false
    },
    jobAssistance: {
        type: Boolean,
        default: false,

    },
    acceptGi: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }


})

module.exports = mongoose.model('BootCamp', BootCampSchema)