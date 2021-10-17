const express = require('express');
const {getCourses, getCourse, addCourse} = require('../controllers/CourseController');

const router = express.Router({mergeParams: true}); // means parameters are being passed after original /


router.route('/')
    .get(getCourses)
    .post(addCourse);

router.route('/:id')
    .get(getCourse);


module.exports = router;
