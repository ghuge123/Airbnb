const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");
const User = require("./user.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url : String,
    filename : String
  },
  price: Number,
  location: String,
  country: String,
  category: {
    type: String ,
    enum: ['Arctic','Boat','Beach','Trending','Castels','Top of world','Creative spaces','Farm','Domes','Rooms','Iconic cities'],
    default: "Trending" 
  },
  reviews : [
    {
      type : Schema.Types.ObjectId,
      ref : "Review"
    }
  ],
  owner : {
    type : Schema.Types.ObjectId,
    ref : "User"
  },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
     
    },
    coordinates: {
      type: [Number],
     
    }
  },
 
});

listingSchema.post("findOneAndDelete" , async(listing)=>{
  if(listing){
    await Review.deleteMany({_id : {$in : listing.reviews}});
  }
  
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;