const path = require('path')
const ErrorResponse = require('../utlis/errorresponse')
const Bootcamp = require('../models/BootCampModel');
const geoCoder = require('../utlis/geoCoder')
const asyncHandler = require('../middleware/async')
const advancedResults = require("../middleware/advancedResult");


//region getBootCamps() --> get all bootcamps-->@route GET /api/v1/bootcamps-->acess  public
exports.getBootCamps = asyncHandler(async (req, res, next) => {


    res.status(200).json(res.advancedResults);
});

//endregion


//region getBootCamp --> get  a single bootcamp-->@route GET /api/v1/bootcamps/:id-->acess  public
exports.getBootCamp = asyncHandler(async (req, res, next) => {

    const bootCamp = await Bootcamp.findById(req.params.id)
    if (!bootCamp) {
        return next(new ErrorResponse(`BootCamp not found with id of ${req.params.id} `, 400));
    }
    res.status(400).json({
        success: true,
        data: bootCamp
    })

});
//endregion


//region createBootCamp  -->  reate single bootcamp --> route POST /api/v1/bootcamps/:id -->/ acess  private
exports.createBootCamp = asyncHandler(async (req, res, next) => {


    const bootCamp = await Bootcamp.create(req.body); // this creates the bootcamp
    res.status(201).json({
        success: true,
        data: bootCamp
    })


});
//endregion


//region updateBootCamp -->@route PUT /api/v1/bootcamps/:id-->access  private
exports.updateBootCamp = asyncHandler(async (req, res, next) => {


    const bootCamp = await Bootcamp.findByIdAndUpdate
    (
        req.params.id, // this is the filter
        req.body, // body will be updated
        {
            new: true, // returns new object after it was applied.
            runValidators: true, // make sure validators are running after.
        }
    );
    if (!bootCamp) {
        return next(new ErrorResponse(`BootCamp not found with id of ${req.params.id} `, 400));

    }
    res.status(200).json({success: true, data: bootCamp});


})
//endregion


//region deleteBootCamp --> @route Delete /api/v1/bootcamps/:id -->access  private
exports.deleteBootCamp = asyncHandler(async (req, res, next) => {


    const bootCamp = await Bootcamp.findById(req.params.id);
    if (!bootCamp) {
        return next(new ErrorResponse(`BootCamp not found with id of ${req.params.id} `, 400));
    }
    bootCamp.remove(); // this will trigger the rmove file object..
    res.status(200).json({success: true, data: {}})


});

//endregion


//region getBootcampwithinAradisu --> @route Delete /api/v1/radius/:zipcode:distance -->access  private
exports.getBootCampsInRadius = asyncHandler(async (req, res, next) => {

    const {zipcode, distance} = req.params; // destrure thooese properites.
    const loc = await geoCoder.geocode(zipcode); // returns an array with lattybe and logtitude,
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    //calc using radians
    //Earth Radius 3,663 miles.

    const radius = distance / 3963

    const bootCamps = await Bootcamp.find({
        location: {$geoWithin: {$centerSphere: [[lng, lat], radius]}}
        //region  location: {$geoWithin: {$centerSphere: [[lng, lat], radius]}}
        /*
        $geoWithin: { $centerSphere: [ [ <x>, <y> ], <radius> ] }
         x--> is for lng
         y--> latitude
         radius --> is for radius pf the earth
         */

        //endregion
    })
    if (!bootCamps) {
        return next(new ErrorResponse(`no bootcamp Found with in the are `, 400));

    }
    res.status(200).json({
        success: true,
        count: bootCamps.length,
        data: bootCamps
    })
});

//endregion


//region FILE UPLOAD For BOOTCAMP PUT/API/v1/bootcamps:id/photo/ acess:private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id); // this the bootcamp ID // get the bootcamp Based on Id


    if (!bootcamp) {
        return next(
            new ErrorResponse(`BootCamp not found with the id of ${req.params.id}`, 404)
        );
    }

    if (!req.files) {
        return next(
            new ErrorResponse(`Please Upload a file`, 400)
        );
    }

    const { file} = {...req.files} // get file from req.files.
 //checks if its a image or not
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please Upload an image file`, 400));
    }
//check file size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`please upload an image less than ${process.env.MAX_FILE_UPLOAD}MB`, 400));
    }


    //create file name for the property
    file.name = `Photo_${bootcamp._id}${path.parse(file.name).ext}`; // get the file name with exrension
    // file mv is a function
    await file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async error => {
        if (error) {
            return next(new ErrorResponse(`something went wrong`, 500))
        }
        await Bootcamp.findByIdAndUpdate(req.params.id, {photo: file.name});

        res.status(200).json(
            {
                success: true,
                data: file.name
            })
    })

})


//endregion