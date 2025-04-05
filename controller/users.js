const User = require("../models/user.js");
const Listing = require("../models/listing.js");

module.exports.renderSignUpForm =  (req , res)=>{
    res.render("users/signUp");
};
module.exports.signUp = async(req , res)=>{
    try{
        let {username , email , password} = req.body;
        const user = new User({email , username});
        const registerUser =await User.register(user , password);
        console.log(registerUser);
        req.login(registerUser , (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success" , "Welcome to Wonderlust");
            res.redirect("/listings");
        });
    }catch(e){
        req.flash("error" , e.message);
        res.redirect("/signUp");
    }
};

module.exports.renderloginForm = (req , res)=>{
    res.render("users/login.ejs");
};

module.exports.login = (req , res)=>{

    req.flash("success","welcome to wanderlust! you're logged in. ");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
};

module.exports.logOut = (req , res , next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success" , "You're logged out!");
        res.redirect("/listings");
    })
};