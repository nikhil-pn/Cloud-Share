const router = require("express").Router();

const File = require("../models/file");
require("dotenv").config();
// const BASE_URL = process.env.APP_BASE_URL;
const BASE_URL = "https://cloudshare.onrender.com";

router.get("/download-page/:uuid", async (req, res) => {
  try {
    const file = await File.findOne({ uuid: req.params.uuid });

    if (!file) {
      return res.status(400).render("downloads", { error: "LInk expired" });
    }
    return res.status(200).render("downloads", {
      uuid: file.uuid,
      fileName: file.fileName,
      fileSize: file.size,
      downloadLink: `${BASE_URL}/api/files/download/${file.uuid}`,
    });
  } catch (error) {
    return res.status(400).render("downloads", { error: error });
  }
});

module.exports = router;