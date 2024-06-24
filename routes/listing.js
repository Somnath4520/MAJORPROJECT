const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {validateListing, isLoggedIn, isOwner } = require("../middleware.js");

const listingController = require("../controllers/listing.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


//search route
router.get("/search",wrapAsync(listingController.search));

//filter route
router.get("/filter/:category",wrapAsync(listingController.filter));

//index route and create listing route
router.route("/").
get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("myListing[image]"), 
    validateListing,
    
    wrapAsync(listingController.createListing));


//new route
router.get("/new",isLoggedIn, listingController.renderNewForm);

//show, update and delete route
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put( isLoggedIn,isOwner,upload.single("myListing[image]"), validateListing ,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));


//edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

// //update route
// router.put("/:id", isLoggedIn,isOwner, validateListing ,wrapAsync(listingController.updateListing));

// //show route
// router.get("/:id",wrapAsync(listingController.showListing));

// //delete route
// router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;