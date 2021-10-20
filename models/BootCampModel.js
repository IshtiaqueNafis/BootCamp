const mongoose = require('mongoose'); // is for coonecting to database
const slugify = require('slugify') // used for conenction to slug.
const geocoder = require('../utlis/geocoder') // used for map geo coder.
const BootCampSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'], // first means true and the sceond parameter means something is wrong.
            unique: true,
            trim: true, // remove white space and characters.
            maxlength: [50, 'Name can not be more than 50 characters']
        },
        slug: String,
        description: {
            type: String,
            required: [true, 'Please add a description'],
            maxlength: [500, 'Description can not be more than 500 characters']
        },
        website: {
            type: String,
            match: [
                /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
                'Please use a valid URL with HTTP or HTTPS'
            ]// this is used for matching.
        },
        phone: {
            type: String,
            maxlength: [20, 'Phone number can not be longer than 20 characters']
        },
        email: {
            type: String,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email'
            ]
        },
        address: {
            type: String,
            required: [true, 'Please add an address']
        },
        location: {
            // GeoJSON Point
            type: {
                type: String,
                enum: ['Point']
            },
            coordinates: {
                type: [Number],
                index: '2dsphere'
            },
            formattedAddress: String,
            street: String,
            city: String,
            state: String,
            zipcode: String,
            country: String
        },
        careers: {
            // Array of strings
            type: [String],
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
            min: [1, 'Rating must be at least 1'],
            max: [10, 'Rating must can not be more than 10']
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
            default: false
        },
        jobGuarantee: {
            type: Boolean,
            default: false
        },
        acceptGi: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        user: {
            type:mongoose.Schema.ObjectId,
            ref:'User',
            required: true
        }
    }, {
        toJSON: {virtuals: true},// this will allow it to have additional property
        toObject: {virtuals: true}, //create javascript object
    }
)
// pre slug
BootCampSchema.pre('save', function (next) {
    this.slug = slugify(this.name, {lower: true})
    next();
})
//GeoCode & create location field
//pre means before its saved to database
BootCampSchema.pre('save', async function (next) {
    const loc = await geocoder.geocode(this.address); // this gets an address
    this.location = {
        type: "Point",
        coordinates: [loc[0].longitude, loc[0].latitude], //0 means is the key
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode
    }
    // do not save address
    this.address = undefined; // cause address will be filled out
    next();
});
//cascadeDelete Courses when a when bootcamp is deleted
BootCampSchema.pre('remove', async function (next) {
    await this.model('Course').deleteMany({bootcamp: this._id}); // only delete bootcamp based on id
    next();
})


//reverse populate wuith virutals
BootCampSchema.virtual('courses', {
    ref: 'Course', // this is the course table name
    localField: '_id', // this will be the id
    foreignField: 'bootcamp',// this the bootcamp id.
    justOne: false, // means get array of courses
})

module.exports = mongoose.model('Bootcamp', BootCampSchema);  // how the model will be named.