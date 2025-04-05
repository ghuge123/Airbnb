const express = require("express");
const router = express.Router({mergeParams : true});
const {validateReview , isLoggedIn ,isAuthor} = require("../middleware.js");
const reviewController = require("../controller/review.js")

//error handling function
function asyncWrap(fn){
    return function(req , res , next){
        fn( req , res , next).catch((err)=>next(err));
    }
  };
  

//Reviews
//Post review route
router.post("/" ,isLoggedIn ,validateReview, asyncWrap(reviewController.postReview));
  
  // Delete review route
  router.delete("/:reviewId" , isLoggedIn , isAuthor ,asyncWrap(reviewController.destroyReview));
  
  module.exports = router;