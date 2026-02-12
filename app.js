const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlist";
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

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

const sessionOptions = {
    secret: "mysupersecertcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        expries: Date.now() + 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
    }
}

app.get("/",(req,res) => {
    res.send("hihe");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.get("/demouser", async(req,res) => {
    let fakeUser = new User({
        email: "student@gmail.com",
        username: "student"
    });
    let registeredUser = await User.register(fakeUser,"student");
    res.send(registeredUser);
})

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);
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