if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
const express = require("express");
const { models } = require("mongoose");
const {listingSchema , reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const initData = require("../init/init.js");
const router = express.Router({mergeParams : true});
const {isLoggedIn , isOwner , validateListing} = require("../middleware.js");
const listenController = require("../controller/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

// const util = require('util');

// // Assuming mongoClient is your MongoClient object
// const inspectedMongoClient = util.inspect(, { depth: null });

// console.log(inspectedMongoClient);


router
.route("/")
.get(listenController.index)
.post( isLoggedIn ,upload.single('listing[image]') ,validateListing, listenController.addNewListing);


//new route
router.get("/new" ,isLoggedIn ,listenController.renderNewForm);

router
.route("/:id") 
.get(listenController.showListing)
.put( isLoggedIn ,isOwner,upload.single('listing[image]') ,validateListing,listenController.editListing )
.delete(isLoggedIn ,isOwner,listenController.destroyListing);

//edit route
router.get("/:id/edit" ,isLoggedIn ,isOwner,listenController.renderEditForm );

module.exports = router;
