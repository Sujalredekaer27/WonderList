const Listing = require("../models/listing");
const Review = require("../models/review");
module.exports.createReview = async(req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview.author);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new review saved");
    req.flash("success","new review is created!");
    res.redirect(`/listings/${req.params.id}`);
};

module.exports.destoryReview = async(req,res)=>{
    let {id,reviewId} = req.params;
    console.log(id,reviewId);
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted!");
    res.redirect(`/listings/${id}`);
};