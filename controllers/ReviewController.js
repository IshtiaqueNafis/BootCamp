const ErrorResponse = require('../utlis/errorresponse')
const Review = require('../models/ReviewModel');
const BootCamp = require('../models/BootCampModel');
const asyncHandler = require('../middleware/async')

//region Get Reviews, GET /api/v1/reviews
exports.getReviews = async (req, res, next) => {

    if (req.params.bookcampId) {
        const reviews = await Review.find({bootCamp: req.params.bookcampId});
        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } else {
        res.status(200).json(res.advancedResults);
    }


}


//endregion