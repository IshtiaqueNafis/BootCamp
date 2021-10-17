const express = require('express');
const {getCourses} = require('../controllers/CourseController');
const router = express.Router({mergeParams: true}); // means parameters are being passed.


router.route('/').get(getCourses);

module.exports = router;
