const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const Review = require("./review.js");
const { required } = require("joi");

const listingSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        url:String,
        filename:String
        // type:String,
        // default:"https://www.istockphoto.com/photo/pond-between-modern-buildings-in-blue-sky-at-twilight-gm505530540-83724923",
        // set:(v)=> v===""? "https://www.istockphoto.com/photo/pond-between-modern-buildings-in-blue-sky-at-twilight-gm505530540-83724923"
        //             :v
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
      {
        type:Schema.Types.ObjectId,
        ref:"Review"
      }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    geometry:{
        type:{
            type:String,
            enum:['Point'] ,// location.type must be point
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        },
    },
    category:{
        type:String,
        enum:["Trending","Rooms","Iconoic cities","Mountain","Castle","Amazing pools","Camping","Farms","Arctic","Boat"],
        required:true
    },
});

//middleware for deleting reviews of deleted listing
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    };
});

const Listing =  mongoose.model("Listing",listingSchema);

module.exports = Listing;