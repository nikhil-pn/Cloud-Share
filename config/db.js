// const mongoose = require("mongoose");

// require("dotenv").config();

// const MONGO_DB_URL = process.env.MONGO_URL;
// mongoose.set("strictQuery", true);

// const MONGO_OPTIONS = {
//   useNewUrlParser: false,
// };

// const connectDB = async () => {
//   try {
//     await mongoose.connect(MONGO_DB_URL, MONGO_OPTIONS);
//     console.log("connected to DB");
//   } catch (error) {
//     console.log(error, "Db Not Connected");
//   }
// };

// module.exports = connectDB;

const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URL = process.env.MONGO_URL;
const MONGO_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://nikhilpn:aG4HT4vDJmuNr9DI@cluster0.uh3by3j.mongodb.net/?retryWrites=true&w=majority", MONGO_OPTIONS); // Database connection 🥳
    console.log("Database Connected 🥳🥳🥳🥳");
  } catch (err) {
    console.log("Could not connect to MongoDB");
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;