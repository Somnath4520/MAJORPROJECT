const express = require("express");
const Listing  = require("../models/listing")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


//search route
module.exports.search = async(req,res)=>{

    let listLocation = req.query.destination;
    //console.log(listLocation);
    if(!listLocation || listLocation==="null"){
     req.flash("error","enter your destination to search");
     res.redirect("/listings");
    }else{
        let allListings =  await Listing.find({$or:[{location:`${listLocation}`},{country:`${listLocation}`}]});
        if(allListings.length){
        res.render("listings/index.ejs",{allListings});
        }else{
            req.flash("error","Sorry!No listing available in your destination..");
            res.redirect("/listings");
        }
    }
    
}

//index route 
module.exports.index = async(req, res)=>{
    let allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};


//new listing form 
module.exports.renderNewForm = (req, res)=>{
    res.render("listings/new.ejs");
};


//show listing 
module.exports.showListing = async(req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path:"reviews",
                  populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","listing you requested for does not exit!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
};


//create listing 
module.exports.createListing = async(req, res)=>{
    // if(!req.body.myListing){
    //     throw new ExpressError(400,"Bad request,send valid data for listing!");
    // };
    const {category } = req.body;
    let response = await geocodingClient.forwardGeocode({
        query: req.body.myListing.location,
        limit:1
    }).send();
   
    let url  = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.myListing); //parse js object
    newListing.owner = req.user._id;  //setting listing owner to user id
    newListing.image = {url,filename};

    newListing.geometry = response.body.features[0].geometry;
    
    let savedListing = await newListing.save();
    console.log(savedListing);
    console.log(req.body.myListing);
    req.flash("success","new listing created");
    res.redirect("/listings");
};


//edit form
module.exports.renderEditForm = async(req,res)=>{
    let {id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","listing you requested for does not exit!");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs",{listing, originalImageUrl});
};


//update listing
module.exports.updateListing = async(req, res)=>{
    let {id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.myListing});

    if(typeof req.file !== "undefined" ){
    let url  = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
    };
    console.log("listing was updated");
    req.flash("success","listing was updated");
    res.redirect(`/listings/${id}`);
};


//delete listing
module.exports.destroyListing = async(req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    console.log("listing deleted");
    req.flash("success","listing deleted");

    res.redirect("/listings");
};