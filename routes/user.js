const express = require("express");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controller/users.js");

//error handling function
function asyncWrap(fn){
    return function(req , res , next){
        fn( req , res , next).catch((err)=>next(err));
    }
  };


router
.route("/signUp")
.get(userController.renderSignUpForm)
.post(asyncWrap(userController.signUp));


router
.route("/login")
.get(userController.renderloginForm)
.post(
    saveRedirectUrl,
    passport.authenticate("local" , {failureRedirect : "/login" , failureFlash : true} ),
    userController.login );


router.get("/logout" , userController.logOut);

module.exports = router ;