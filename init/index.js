const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlist";
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

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj,owner: '698dda11cc8846a90659f9b2'}));
    await Listing.insertMany(initData.data);
    console.log("data was initialLized");
};

initDB();