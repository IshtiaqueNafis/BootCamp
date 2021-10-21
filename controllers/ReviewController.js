const ErrorResponse = require('../utlis/errorresponse')
const Review = require('../models/ReviewModel');
const Bootcamp = require('../models/BootCampModel');
const asyncHandler = require("../middleware/async");

//region Get Reviews, GET /api/v1/reviews
exports.getReviews = asyncHandler(async (req, res, next) => {
    if (req.params.bootcampId) {
        const reviews = await Review.find({bootcamp: req.params.bootcampId});
        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } else {
        res.status(200).json(res.advancedResults);
    }
});


//endregion

//region get a single review GET /api/v1/reviews/:id
exports.getReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'

    });
    if (!review) {
        return next(new ErrorResponse('No review found', 404))
    }

    res.status(200).json({
        success: true,
        data: review
    });
})


//endregion


//region add a review -->Post --> /api/v1/:bootcamps/bootcamps/reviews
exports.addReview = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id; // this comes from the bear token

    const bootcamp = await Bootcamp.findById(req.params.bootcampId)
    if (!bootcamp) {
        return next(new ErrorResponse(`No bootcamp found with the id of ${req.params.bootcampId}`, 404))
    }

    const review = await Review.create(req.body)

    res.status(201).json({
        success: true,
        data: review
    })
})


//end region

//region add a review -->PUT --> /api/v1//reviews:/id
exports.updateReview = asyncHandler(async (req, res, next) => {


    let review = await Review.findById(req.params.id)
    if (!review) {
        return next(new ErrorResponse(`No review found`, 404))
    }
//make sure review belongs to user or admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`Not Authorized`, 401))
    }
    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(201).json({
        success: true,
        data: review
    })
})


//endregion

//region DELETE REVIEW /api/v1//reviews:/id

exports.deleteReview = asyncHandler(async (req, res, next) => {


    let review = await Review.findById(req.params.id)
    if (!review) {
        return next(new ErrorResponse(`No review found`, 404))
    }
//make sure review belongs to user or admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`Not Authorized`, 401))
    }
    await review.remove()

    res.status(201).json({
        success: true,
        data: {}

    })
})

//endregion


//endregion