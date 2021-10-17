const ErrorResponse = require('../utlis/errorresponse')
const Course = require('../models/CourseModel');
const BootCamp = require('../models/BootCampModel');
const asyncHandler = require('../middleware/async')

//region getcoursess() --> get all bootcamps-->@route GET /api/v1/:bootcampId/courses
exports.getCourses = asyncHandler(async (req, res, next) => {
    let query;
    if (req.params.bootcampId) {
        query = Course.find({bootcamp: req.params.bootcampId});
    } else {
        // this will return a bootcamp with course with everything
        // query=Course.find().populate('bootcamp') // this will get the details id for the bootcamp.
        query = Course.find().populate({
            path: 'bootcamp',
            select: 'name description '


        }) // will only show name and description.
    }

    const courses = await query;

    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses

    })
})

//endregion

//region get a single course  course  --> get course based on Id-->@route GET /api/v1/:bootcampId/courses
exports.getCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    })

    if (!course) {
        return next(new ErrorResponse(`no Course with the id ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        data: course
    })
});


//endregion

//region Create course  --> get course based on Id-->@route GET /api/v1/courses

exports.addCourse = asyncHandler(async (req, res, next) => {
    const bootCamp = await BootCamp.findById(req.params.bootcampId); //first get bootcamp based on ID
    if (!bootCamp) {
        return next(
            new ErrorResponse(`No Bootcamp with Id of ${req.params.bootcampId}`)
        )
    }
    req.body.bootcamp = req.params.bootcampId; // from there get first set


    const course = await Course.create(req.body);

    res.status(200).json({
        success: true,
        data: course
    })

});





