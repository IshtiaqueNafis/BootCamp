const express = require('express')
const router = express.Router();
const {getBootCamps, getBootCamp, deleteBootCamp, createBootCamp, updateBootCamp} = require('../controllers/bootcamps') // exporting all the functions.

router.route('/')
        .get(getBootCamps) // this will be for getting all the bootcamps
        .post(createBootCamp) // post is for creating bootcapms
router.route('/:id')
        .get(getBootCamp) // get bootcamps based on id
        .put(updateBootCamp) // update bootcamps based on update
        .delete(deleteBootCamp) // delete based on delete.
module.exports = router
