const express = require("express");
const router = express.Router(); 
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");

const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg)
    } else {
        next();
    }
}

//Index Route
router.get("/",wrapAsync (async (req,res) => {
    let allListing = await Listing.find({});
    res.render("listing/index.ejs",{allListing});
}));

//New Route
router.get("/new",isLoggedIn,(req,res) => {
    console.log(req.user);
    res.render("listing/new.ejs");
});

//Create Route
router.post("/",isLoggedIn,validateListing, wrapAsync( async (req, res, next) => {
    if(!req.body.listing) {
        throw new ExpressError(400,"Send valid data for listing")
    }
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New Listing is created!");
    res.redirect("/listings");
}));

//Show Route
router.get("/:id",wrapAsync (async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id).populate("reviews").populate("owner");
    console.log(listing);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listing/show.ejs",{listing});
}));

//Edit Route
router.get("/:id/edit",isLoggedIn,wrapAsync (async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listing/edit.ejs",{listing});
}));

//Update Route
router.put("/:id",isLoggedIn,validateListing,wrapAsync (async (req,res) => {
    if(!req.body.listing) {
        throw new ExpressError(400,"Enter a valid data for listing")
    }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","listing is updated successfully!");
    res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/:id",isLoggedIn,wrapAsync (async(req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted!");
    res.redirect("/listings");
}));

module.exports = router;