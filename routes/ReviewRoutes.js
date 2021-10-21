const express = require('express');
const Review = require('../models/ReviewModel')
const advancedResults = require("../middleware/advancedResult");
const {getReviews, getReview, addReview} = require("../controllers/ReviewController");
const {protect, authorized} = require("../middleware/auth");

const router = express.Router({mergeParams: true});

router.route('/')
    .get(advancedResults(Review, {
        path: 'bootcamp',
        select: 'name description'
    }), getReviews)
    .post(protect, authorized('user','admin'), addReview)
router.route("/:id")
    .get(getReview)

module.exports = router;