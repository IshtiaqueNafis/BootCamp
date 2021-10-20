const ErrorResponse = require('../utlis/errorresponse')
const Course = require('../models/CourseModel');
const BootCamp = require('../models/BootCampModel');
const asyncHandler = require('../middleware/async')

//region getcoursess() --> get all bootcamps-->@route GET /api/v1/:bootcampId/courses
exports.getCourses = asyncHandler(async (req, res, next) => {

    if (req.params.bookcampId) {
        const courses = await Course.find({bootcamp: req.params.bootcampId})
        return res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        })
    } else {
        res.status(200).json(res.advancedResults)
    }

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
    req.body.bootcamp = req.params.bootcampId; // from there get first set
    const bootCamp = await BootCamp.findById(req.params.bootcampId); //first get bootcamp based on ID
    req.body.user = req.user.id;
    if (!bootCamp) {
        return next(
            new ErrorResponse(`No Bootcamp with Id of ${req.params.bootcampId}`)
        )
    }

    if (bootCamp.user.toString() !== req.user.id && req.user !== 'admin') {
        //user is saved on the looged in when a user logged in
        return next(new ErrorResponse(`user can not modify ${req.user.id} this course `, 401));
    }

    const course = await Course.create(req.body);

    res.status(200).json({
        success: true,
        data: course
    })

});
//endregion


//region Updatecourse  --> updatecourse Id-->@route put /api/v1/courses

exports.updateCourse = asyncHandler(async (req, res, next) => {
    let course = await Course.findById(req.params.id)

    if (!course) {
        return next(new ErrorResponse(`no Course with the id ${req.params.id}`, 404))
    }
    if (course.user.toString() !== req.user.id && req.user !== 'admin') {
        //user is saved on the looged in when a user logged in
        return next(new ErrorResponse(`user can not modify ${req.user.id} this course `, 401));
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: course
    })


});

//region Updatecourse  --> updatecourse Id-->@route put /api/v1/courses

exports.deleteCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
        return next(new ErrorResponse(`no Course with the id ${req.params.id}`, 404))
    }
    if (course.user.toString() !== req.user.id && req.user !== 'admin') {
        //user is saved on the looged in when a user logged in
        return next(new ErrorResponse(`user can not modify ${req.user.id} this course `, 401));
    }
    await course.remove();
    res.status(200).json({
        success: true,
        data: {}

    })


});
//endregion


//endregion


