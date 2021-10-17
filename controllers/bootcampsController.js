const ErrorResponse = require('../utlis/errorresponse')
const Bootcamp = require('../models/BootCampModel');
const geoCoder = require('../utlis/geoCoder')
const asyncHandler = require('../middleware/async')


//region getBootCamps() --> get all bootcamps-->@route GET /api/v1/bootcamps-->acess  public
exports.getBootCamps = asyncHandler(async (req, res, next) => {
    let query; // this the query

    //copy req.query
    const reqQuery = {...req.query}; // this will be breaking down.
    console.log(reqQuery)

    //fields to exclude from query
    const removeFields = ['select', 'sort', 'page', 'limit',]; // array will have the following value which is select query.

    //Loop over Remove fields and delete them from reqQuery
    for (const param of removeFields) {
        // loops thrrough param if
        delete reqQuery[param];
    }
    console.log(reqQuery)

    // loop over reququery if it contains select remove it .


    //create query string
    let queryStr = JSON.stringify(reqQuery); // req.query is coming from req.query
    // convert it to JSON file
    console.log(queryStr)


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
   // convert it to javascript object
    //SelectFields
    if (req.query.select) {
        const selectStatement = req.query.select.split(',').join(' '); // if there is a comma turns into an array then combine into string with spaces
        query = query.select(selectStatement); // if a name is here it will only pass thoose things.
    }

    //sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' '); // if there is a comma turns into an array then combine into string with spaces
        query = query.sort(sortBy); // if a name is here it will only pass thoose things.
    } else {
        query = query.sort('-createdAt'); //- means in decendinbg order
    }

    //const page
    const page = parseInt(req.query.page, 10) || 1; // ususally parse int come by string.

    const limit = parseInt(req.query.limit, 10) || 100; // ususally parse int come by string.

    const startIndex = (page - 1) * limit; // start of the page. //0

    const endIndex = page * limit; // this will show the end of page //1

    //region ***page,limit,startIndex&endIndex explained***

    /*
    const page = parseInt(req.query.page, 10) || 1 --> by defualt page is 1 however it can be any page I would want it to be.
     const limit = parseInt(req.query.limit, 10) || 100;  --> by default set to 100 however can be many page as possilbe.
         const startIndex = (page - 1) * limit; //
         lets say I am on page (1-1) * 1 -->0 index 2-->(2-1)*1 -->1 and so on its -1 here cause index always starrt from

           const endIndex = page * limit; --> page is 1 and and limit is 1 endindex will be 1 if its 2 will be 2
     */

    //endregion

    const total = await Bootcamp.countDocuments()

    query = query.skip(startIndex).limit(limit);

    //foinding query
    const bootCamps = await query;

    //pagination Result

    // for going foroward
    const pagination = {};
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
        //crates a nested object // { next: { page: 2 } }
    }

    //for going backward
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }


    res.status(200).json({
        success: true, //means true
        count: bootCamps.length, // how many were recived
        data: bootCamps, // data for bootcamps.
        pagination // pagination object,
    });
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


    const bootCamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootCamp) {
        return next(new ErrorResponse(`BootCamp not found with id of ${req.params.id} `, 400));
    }
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


