const mongoose = require("mongoose");

require("dotenv").config();

const MONGO_DB_URL = process.env.MONGO_DB_URL;
mongoose.set("strictQuery", true);

const MONGO_OPTIONS = {
  useNewUrlParser: false,
};

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_DB_URL, MONGO_OPTIONS);
    console.log("connected to DB");
  } catch (error) {
    console.log(error);
  }
};

module.exports = { connectDB };
