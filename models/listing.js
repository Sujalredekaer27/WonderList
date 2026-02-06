const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js")
const ListingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        filename: { 
            type: String, 
            default:"filename",
        },
        url: {
            type: String,
            default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH1BT6ZtjhsJ6Yy3stL7pQxGPifqoeceL7vQ&s",
            set: (v) => v === "" ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH1BT6ZtjhsJ6Yy3stL7pQxGPifqoeceL7vQ&s" : v,
        }
    },
    price: Number,
    location: String,
    country: String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        }
    ]
});

ListingSchema.post("findOneAndDelete", async (listing) => {
    if(listing) {
        await Review.deleteMany({_id : {$in: listing.reviews}});
    }
})
const Listing = mongoose.model("Listing",ListingSchema);


module.exports = Listing;