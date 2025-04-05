const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

module.exports.postReview = async(req , res)=>{
    let {id} = req.params;
    req.flash("success" , "New Review add successfully!");
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
  
    res.redirect(`/listings/${id}`);
  
  };

  module.exports.destroyReview = async(req , res)=>{
    let {id , reviewId}=req.params;
    req.flash("success" , "review deleted successfully!");
    await Listing.findByIdAndUpdate(id , {$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
  
    res.redirect(`/listings/${id}`);
  
  };