const ErrorResponse = require('../utlis/errorresponse')
const Course = require('../models/CourseModel');
const asyncHandler = require('../middleware/async')

//region getBootCamps() --> get all bootcamps-->@route GET /api/v1/:bootcampId/courses
exports.getCourses = asyncHandler(async(req,res,next)=>{
    let query;
    if(req.params.bootcampId){
        query = Course.find({bootcamp: req.params.bootcampId});
    }else{
        query=Course.find() //find everything if the route is not matches
    }

    const courses = await query;

    res.status(200).json({
        success: true,
        count:courses.length,
        data: courses
        
    })
})

//endregion