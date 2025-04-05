const mongoose = require("mongoose");
const initData = require("./init.js");
const Listing = require("../models/listing.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/listening";
const dbURL = process.env.ATLAS_URL;
 
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbURL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj)=>({...obj , owner : '65e08ef7d379d4aecbfd237e'}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
} 

initDB();