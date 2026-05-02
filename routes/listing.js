const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");


const multer = require("multer");
const {storage}= require("../cloudconfig.js");
const upload = multer({storage});


router.route("/")     //merged both path so no conflict arised using router.router
 .get(wrapAsync(listingController.index))//Index Route ,,  calling index conotroller of listings
 .post(isLoggedIn ,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing))// Create Route
 

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);


router.route("/:id")
 .get(wrapAsync(listingController.showListing))//Show Route
 .put(isLoggedIn , isOwner,upload.single("listing[image]"),validateListing , wrapAsync(listingController.updateListing))//Update Route
 .delete(isLoggedIn ,isOwner, wrapAsync(listingController.deleteListing)); //Delete Route

 
//Edit Route
router.get("/:id/edit", isLoggedIn ,isOwner, wrapAsync(listingController.renderEditForm));

//filter listing category
router.get("/category/:category", async (req, res) => {
  const { category } = req.params;
  const filteredListings = await Listing.find({ category });
  res.render("listings/index.ejs", { allListings: filteredListings });
});





module.exports = router;