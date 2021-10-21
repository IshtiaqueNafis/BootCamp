const express = require('express');
const Review = require('../models/ReviewModel')
const Course = require('../models/CourseModel')
const advancedResults = require("../middleware/advancedResult");
const {getReviews} = require("../controllers/ReviewController");

const router = express.Router({mergeParams:true});

router.route('/')
      .get(advancedResults(Review,{
          path:'bootcamp',
          select:'name,description'
      }),getReviews)

module.exports = router;