const { models } = require("mongoose");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const { data } = require("../init/init.js");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//error handling function
function asyncWrap(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((err) => next(err));
  }
};


module.exports.index = asyncWrap(async (req, res) => {
  const allListings = await Listing.find();
  res.render("listing/index.ejs", { allListings });
});

module.exports.renderNewForm = (req, res) => {
  res.render("listing/new.ejs");
};

module.exports.showListing = asyncWrap(async (req, res, next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested is not exist!");
    res.redirect("/listings");
  }
  res.render("listing/show.ejs", { listing });
});

module.exports.addNewListing = asyncWrap(async (req, res, next) => {
  let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
  })
  console.log(response);
  let url = req.file.path;
  let filename = req.file.filename;
  console.log(req.body.listing);
  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body?.features[0]?.geometry || "";
  let savedListing = await newListing.save();
  console.log(savedListing);
  req.flash("success", "New Listening add successfully!");
  res.redirect("/listings");

});

module.exports.renderEditForm = asyncWrap(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested is not exist!");
    res.redirect("/listings");
  }
  let originalUrl = listing.image.url;
  originalUrl = originalUrl.replace("/upload", "/upload/h_300,w_300");
  res.render("listing/edit.ejs", { listing, originalUrl });
});

module.exports.editListing = asyncWrap(async (req, res) => {
  const { id } = req.params;
  if (!req.body.listing) {
    next(new ExpressError(400, "send valid data"));
  }
  let updateListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    updateListing.image = { url, filename };
    await updateListing.save();
  }
  req.flash("success", "Listening eddited successfully!");
  res.redirect(`/listings/${id}`);
});

module.exports.destroyListing = asyncWrap(async (req, res) => {
  const { id } = req.params;
  req.flash("success", "Listening deleted successfully!");
  const listing = await Listing.findById(id);
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});
