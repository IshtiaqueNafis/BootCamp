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
        enum: ["beginner", "intermediate", "advanced"]
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

    }, user: {
        type: mongoose.Schema.ObjectId, // this means this will be the foregin key
        ref: 'User',
        required: true
    }


});

//region static method to get course tuition
//statics means it will run on courseSchema
CourseSchema.statics.getAverageCost = async function (bootcampId) {
    console.log(`Calculating average cost`);
    const obj = await this.aggregate([
        // this is a pipie line so do the avrage cost based on bootcamp Id
        {
            $match: {bootcamp: bootcampId} // use match to find the bootcamp Id.

        },
        //first find the bootcamp with id
        {
            $group: {
                _id: '$bootcamp', // group by id $must be given here for it to work // get the id of the bootcamp foregin key
                averageCost: {$avg: '$tuition'}  // then get the avrage ost based on tutiton property
            }
        }
    ]);


    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageCost: Math.ceil(obj[0].averageCost / 10) * 10
        });
        // by using this.model will allow to use the Bootcamp model on BootcampModel Schema
        // $match: {bootcamp: bootcampId} --> means this will refer to the bootcamp from the model
        // obj[0].averageCost --> cause returns a 0 object in array

    } catch (e) {
        console.log(e);
    }


}
//endregion

//call average cost after save // this is post cause save is calculated after update
CourseSchema.post('save', function () {

    this.constructor.getAverageCost(this.bootcamp); //$match: {bootcamp: bootcampId} bootcamp is coming from here
})

//remove calculation after removing item.
CourseSchema.pre('remove', function () {

    this.constructor.getAverageCost(this.bootcamp); ////$match: {bootcamp: bootcampId} bootcamp is coming from here
})


module.exports = mongoose.model('Course', CourseSchema);