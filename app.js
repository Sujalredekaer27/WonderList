const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const port = 8080;
const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlist";
const path = require("path");

const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const {listingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js")

app.engine("ejs", ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));

main()
    .then(() => {
        console.log("Connected Successfully To DataBase");
    })
    .catch((err) => {
        console.log(err);
    })

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.get("/",(req,res) => {
    res.send("hihe");
});

const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let arrMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg)
    } else {
        next();
    }
}

const validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let arrMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg)
    } else {
        next();
    }
}
// app.get("/testListing",async (req,res) => {
//     let sampleListing = new Listing({
//         title : "New Villa",
//         description : "By the beach",
//         price : 1500,
//         location : "Calangute, Goa",
//         country : "India",
//     });
//     await sampleListing.save();
//     console.log("Successful");
//     res.send("Successful");
// });

//Index Route
app.get("/listings",wrapAsync (async (req,res) => {
    let allListing = await Listing.find({});
    res.render("listing/index.ejs",{allListing});
}));

//New Route
app.get("/listings/new",(req,res) => {
    res.render("listing/new.ejs");
});

//Create Route
app.post("/listings",validateListing, wrapAsync( async (req, res, next) => {
    if(!req.body.listing) {
        throw new ExpressError(400,"Send valid data for listing")
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

//Show Route
app.get("/listings/:id",wrapAsync (async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    console.log(listing);
    res.render("listing/show.ejs",{listing});
}));

//Edit Route
app.get("/listings/:id/edit",wrapAsync (async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listing/edit.ejs",{listing});
}));

//Update Route
app.put("/listings/:id",validateListing,wrapAsync (async (req,res) => {
    if(!req.body.listing) {
        throw new ExpressError(400,"Enter a valid data for listing")
    }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id",wrapAsync (async(req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

//Review Route
app.post("/listings/:id/reviews",validateReview, wrapAsync (async(req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new review saved");
    res.redirect(`/listings/${req.params.id}`);
}));

//Delete Review
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/:id`);
}));

app.all(/.*$/, (req, res, next) => {
    next(new ExpressError(404, "Page Not found!"));
})

app.use((err,req,res,next) => {
    let {statusCode=500, message="Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
})

app.listen(port,() => {
    console.log("Server is listening to port 8080");
});