const ErrorResponse = require('../utlis/errorresponse')
const Review = require('../models/ReviewModel');
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

//region get a single review.
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