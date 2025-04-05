const { model } = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema , reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req  , res , next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "You must be logged In!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req , res , next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req , res , next)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error" , "You're not a owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isAuthor = async(req , res , next)=>{
    let {id , reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error" , "You're not a author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

// server side Schema validation 
module.exports.validateListing = (req , res , next)=>{
    const {error} = listingSchema.validate(req.body);
      if(error){
        let errmsg = error.details.map((el)=>el.message).join(",");
        next(new ExpressError(400 , errmsg));
      }else{
        next();
      }
  };

  //review validation
  module.exports.validateReview = (req , res , next) =>{
    const {error} = reviewSchema.validate(req.body);//through review schema we can validate req body.
      console.log(error);
      if(error){
        let errmsg = error.details.map((el)=>el.message).join(",");
        next(new ExpressError(400 , errmsg));
      }else{
        next();
      }
  };
