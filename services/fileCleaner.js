require("dotenv").config({ path: "../.env" });
const File = require("../models/file");
const fs = require("fs");

const fetchAndDeleteData = async () => {
  try {
    const files = await File.find({
      createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    if (files.length) {
      for (let file of files) {
        try {
          fs.unlinkSync("../" + file.path);
          await file.remove();
        } catch (error) {
          console.log(error);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {fetchAndDeleteData}