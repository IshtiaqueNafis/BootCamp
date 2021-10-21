const express = require('express');
const Review = require('../models/ReviewModel')
const advancedResults = require("../middleware/advancedResult");
const {getReviews, getReview} = require("../controllers/ReviewController");

const router = express.Router({mergeParams:true});

router.route('/')
      .get(advancedResults(Review,{
          path:'bootcamp',
          select:'name description'
      }),getReviews)
router.route("/:id")
    .get(getReview)

module.exports = router;