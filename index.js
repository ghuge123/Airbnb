const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const { connected } = require("process");
const initData = require("./init/init.js");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const listingRoute = require("./routes/listing.js");
const reviewRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const Listing = require("./models/listing.js");

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname , "/public")));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));

// const dbURL = process.env.ATLASDB_URL;
const dbURL = process.env.ATLAS_URL;
console.log(dbURL);

const store = MongoStore.create({
  mongoUrl: dbURL,
  crypto: {
    secret: "mysupersecretstring"
  },
  touchAfter: 24 * 36000,
});

store.on("error" , ()=>{
  console.log("Error in MONGO SESSION STORE " , err)
});

const sessionOptions = {
  store,
  secret:"mysupersecretstring" ,
  resave:false ,
  saveUninitialized : true,
  cookie : {
    expires : Date.now() + 7 * 24 * 60 * 60 * 1000 ,
    maxAge : 7 * 24 * 60 * 60 * 1000 ,
    httpOnly : true
  }
};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbURL);
};

app.use((req , res , next)=>{
  res.locals.successMsg = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  res.locals.currUser = req.user;
  next();
  
});

// app.get("/demoUser" , async(req , res)=>{
//   let fakeUser = new User({
//     email : "dipak@123",
//     username : "dipak"
//   });

//   let registerUser = await User.register(fakeUser , "hello");
//   res.send(registerUser);
// })

//use routes
app.get("/" , (req , res)=>{
  res.redirect("/listings");
})

app.use("/listings" , listingRoute);
app.use("/listings/:id/reviews" , reviewRoute);
app.use("/" , userRoute);

app.get("/listing" , async(req , res)=>{
  const { category , search} = req.query;
  let filter = {};
  if (category) {
    filter.category = category
  }
  if(search){
    filter.location = {$regex: search , $options:'i'};
}
  const listings = await Listing.find(filter);
  if(!listings.length){
    req.flash("error" , "Can not get location!");
    res.redirect("/listings");
}else{
  res.render("listing/category.ejs" , {listings});
}
  
})

app.listen(3000 , ()=>{
    console.log("app is listening");
});

// app.get("/" , (req , res)=>{
//     res.send("server connected");
// });

// for invalid route
app.use("*" , (req , res , next)=>{
  next(new ExpressError(404 , "PAGE NOT FOUND!"));
});

//error handling middleware
app.use((err , req ,res , next)=>{
  let{status = 500 , message = "SOMETHING WRONG"}=err;
  res.status(status).render("error.ejs" , {message});
})

// const initDB = async () => {
//     await Listing.deleteMany({});
//     await Listing.insertMany(initData.data);
//     console.log("data was initialized");
//   };
  
//   initDB();


// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });
//    let a = await sampleListing.save();
//   console.log(a);
//   res.send("successful testing");
// });
