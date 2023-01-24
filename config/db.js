const mongoose = require("mongoose");

require("dotenv").config();

const MONGO_DB_URL = process.env.MONGO_DB_URL;
const MONGO_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopplogy: true,
};

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_DB_URL, MONGO_OPTIONS);
    console.log("connected to DB");
  } catch (error) {
    console.log(error);
  }
};
