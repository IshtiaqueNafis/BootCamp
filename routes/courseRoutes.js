const express = require('express');
const {getCourses, getCourse, addCourse, updateCourse, deleteCourse} = require('../controllers/CourseController');
const advancedResults = require('../middleware/advancedResult');
const Course = require('../models/CourseModel')
const {protect, authorized} = require('../middleware/auth')
const router = express.Router({mergeParams: true}); // means parameters are being passed after original /


router.route('/')
    .get(advancedResults(Course, {
        path: 'bootcamp',
        select: 'name description'
    }), getCourses)
    .post(protect, addCourse);

router.route('/:id')
    .get(getCourse)
    .put(protect, authorized('admin', 'publisher'), updateCourse)
    .delete(protect, authorized('admin', 'publisher'), deleteCourse)


module.exports = router;
