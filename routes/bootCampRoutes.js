//region base files
const express = require('express')
const router = express.Router(); //router is for routing
const {
    getBootCamps,
    getBootCamp,
    deleteBootCamp,
    createBootCamp,
    updateBootCamp,
    getBootCampsInRadius
} = require('../controllers/bootcampsController') // exporting all the functions.

//exporting the routes from course routes
const courseRouter = require('./courseRoutes');

// for generic course router this will be followed.
router.use('/:bootcampId/courses', courseRouter);

//region BootCamp Specific Routes
// gets bootcamp and creates bootcamp.
router.route('/')
    .get(getBootCamps) // this will be for getting all the bootcamps
    .post(createBootCamp) // post is for creating bootcapms
// update bootcamp,get bootcamp and delete bootcamp
router.route('/:id')
    .get(getBootCamp) // get bootcamps based on id
    .put(updateBootCamp) // update bootcamps based on update
    .delete(deleteBootCamp) // delete based on delete.
module.exports = router
// get bootcamp based on zipcode
router.route('/radius/:zipcode/:distance')
    .get(getBootCampsInRadius)

//endregion