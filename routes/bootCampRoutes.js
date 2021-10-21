//region base files
const express = require('express')
const router = express.Router(); //router is for routing
const {
    getBootCamps,
    getBootCamp,
    deleteBootCamp,
    createBootCamp,
    updateBootCamp,
    getBootCampsInRadius,
    bootcampPhotoUpload,
} = require('../controllers/bootcampsController') // exporting all the functions.
const Bootcamp = require('../models/BootCampModel');
const advancedResults = require('../middleware/advancedResult'); // advanced results qeury
//exporting the routes from course routes
const courseRouter = require('./courseRoutes');
const reviewRouter = require('./ReviewRoutes')
const {protect,authorized} = require('../middleware/auth');
// for generic course router this will be followed.
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter);

router.route('/')
    .get(advancedResults(Bootcamp, 'courses'), getBootCamps) // this will be for getting all the bootcamps
    .post(protect,authorized('admin','publisher'), createBootCamp) // post is for creating bootcapms


router.route('/:id')
    .get(getBootCamp) // get bootcamps based on id
    .put(protect,authorized('admin','publisher'), updateBootCamp) // update bootcamps based on update
    .delete(protect,authorized('admin','publisher'), deleteBootCamp) // delete based on delete.


router.route('/radius/:zipcode/:distance')
    .get(getBootCampsInRadius)

router.route("/:id/photo").put(protect,authorized('admin','publisher'), bootcampPhotoUpload);
module.exports = router