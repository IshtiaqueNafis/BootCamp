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

//region Reroute into Other Resources
const courseRouter = require('./courseRoutes');
router.use('/:bootcampId/courses', courseRouter);
// check if there is a bootcampid followed by courses then move it to course Router.

//endregion


//endregion
router.route('/radius/:zipcode/:distance')
    .get(getBootCampsInRadius)

router.route('/')
    .get(getBootCamps) // this will be for getting all the bootcamps
    .post(createBootCamp) // post is for creating bootcapms

router.route('/:id')
    .get(getBootCamp) // get bootcamps based on id
    .put(updateBootCamp) // update bootcamps based on update
    .delete(deleteBootCamp) // delete based on delete.
module.exports = router
