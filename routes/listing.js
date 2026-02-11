const express = require("express");
const router = express.Router(); 
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");

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
router.get("/new",(req,res) => {
    res.render("listing/new.ejs");
});

//Create Route
router.post("/",validateListing, wrapAsync( async (req, res, next) => {
    if(!req.body.listing) {
        throw new ExpressError(400,"Send valid data for listing")
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success","New Listing is created!");
    res.redirect("/listings");
}));

//Show Route
router.get("/:id",wrapAsync (async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    console.log(listing);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listing/show.ejs",{listing});
}));

//Edit Route
router.get("/:id/edit",wrapAsync (async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listing/edit.ejs",{listing});
}));

//Update Route
router.put("/:id",validateListing,wrapAsync (async (req,res) => {
    if(!req.body.listing) {
        throw new ExpressError(400,"Enter a valid data for listing")
    }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","listing is updated successfully!");
    res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/:id",wrapAsync (async(req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted!");
    res.redirect("/listings");
}));

module.exports = router;