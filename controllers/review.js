const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


//create review
module.exports.createReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    //adding logged in user id to author
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    console.log("new review was saved");
    req.flash("success","new review created");

    res.redirect(`/listings/${listing._id}`);
};

//delete review
module.exports.destroyReview = async(req, res)=>{
    let{id,reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted");

    res.redirect(`/listings/${id}`);
};

