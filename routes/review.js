const express = require("express");
const router = express.Router({mergeParams : true}); 
const {reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js")
const {listingSchema} = require("../schema.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const reviewController = require("../controllers/review.js");

const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js");

//Review Route
router.post("/",isLoggedIn,validateReview, wrapAsync (reviewController.createReview));

//Delete Review
router.delete("/:reviewId",isReviewAuthor,wrapAsync(reviewController.destoryReview));

module.exports = router;