const ErrorResponse = require('../utlis/errorresponse')
const Bootcamp = require('../models/BootCamp');
const geoCoder = require('../utlis/geoCoder')
const asyncHandler = require('../middleware/async')


//region getBootCamps() --> get all bootcamps-->@route GET /api/v1/bootcamps-->acess  public
exports.getBootCamps = asyncHandler(async (req, res, next) => {
    let query;


    //copy req.query
    const reqQuery = {...req.query}

    //fileds to exclude
    const removeFields = ['select', 'sort']; // array will have the following value which is select query.

    //Loop over Remove fields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    // loop over reququery if it contains select remove it .

    console.log(reqQuery)

    //create query string
    let queryStr = JSON.stringify(reqQuery); // req.query is coming from req.query


    //create Operators ($GT,$ltg)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    //region ****queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)****
    //
    /*
    gt--> greather than
    gte --> greater than equal to
    lt --> less than
    lte --> less than or equal to
    in --> means will get a list
    match => `$${match} will be either gt,gte,lt,lte in
     */

    //endregion


    //finding resource
    query = Bootcamp.find(JSON.parse(queryStr)); // get the id based on query str

    //SelectFields
    if (req.query.select) {
        const sortBy = req.query.select.split(',').join(' ') // if there is a comma turns into an array then combine into string with spaces
        query = query.select(sortBy) // if a name is here it will only pass thoose things.
    }


    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ') // if there is a comma turns into an array then combine into string with spaces
        query = query.sort(sortBy) // if a name is here it will only pass thoose things.
    } else {
        query = query.sort('-createdAt'); //- means in decendinbg order
    }
    //foinding query
    const bootCamps = await query;


    res.status(200).json({
        success: true,
        count: bootCamps.length,
        data: bootCamps
    });
});

//exports is used for exporting function
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


    const bootcamp = await Bootcamp.create(req.body); // this creates the bootcamp
    res.status(201).json({
        success: true,
        data: bootcamp
    })


});
//endregion


//region updateBootCamp -->@route PUT /api/v1/bootcamps/:id-->access  private
exports.updateBootCamp = asyncHandler(async (req, res, next) => {


    const bootCamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!bootCamp) {
        return next(new ErrorResponse(`BootCamp not found with id of ${req.params.id} `, 400));

    }
    res.status(200).json({success: true, data: bootCamp});


})
//endregion


//region deleteBootCamp --> @route Delete /api/v1/bootcamps/:id -->access  private
exports.deleteBootCamp = asyncHandler(async (req, res, next) => {


    const bootCamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootCamp) {
        return next(new ErrorResponse(`BootCamp not found with id of ${req.params.id} `, 400));
    }
    res.status(200).json({success: true, data: {}})


});

//endregion


//region getBootcampwithinAradisu --> @route Delete /api/v1/radius/:zipcode:distance -->access  private
exports.getBootCampsInRadius = asyncHandler(async (req, res, next) => {

    const {zipcode, distance} = req.params;
    const loc = await geoCoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    //calc using radians
    //Earth Radius 3,663 miles.

    const radius = distance / 3963

    const bootcamps = await Bootcamp.find({
        location: {$geoWithin: {$centerSphere: [[lng, lat], radius]}}
    })
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })
});

//endregion


