const express = require("express");
const router = express.Router({mergeParams : true}); 
const {reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js")
const {listingSchema} = require("../schema.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const {validateReview,isLoggedIn} = require("../middleware.js");

//Review Route
router.post("/",isLoggedIn,validateReview, wrapAsync (async(req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new review saved");
    req.flash("success","new review is created!");
    res.redirect(`/listings/${req.params.id}`);
}));

//Delete Review
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;
    console.log(id,reviewId);
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted!");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;