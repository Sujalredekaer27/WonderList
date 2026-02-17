const Listing = require("../models/listing");
module.exports.index = async (req,res) => {
    let allListing = await Listing.find({});
    res.render("listing/index.ejs",{allListing});
};

module.exports.renderNewForm = (req,res) => {
    console.log(req.user);
    res.render("listing/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
    if(!req.body.listing) {
        throw new ExpressError(400,"Send valid data for listing")
    }
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New Listing is created!");
    res.redirect("/listings");
};

module.exports.showListing = async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: { path: "author" }
    }).populate("owner");
    console.log(listing);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listing/show.ejs",{listing});
};