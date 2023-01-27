const router = require("express").Router();

const upload = require("../config/fileUpload");
const { v4: uuidv4 } = require("uuid");
const File = require("../models/file");
const sendEmail = require("../services/email");
const emailTemplate = require("../utilis/emailTemplate");
const BASE_URL = process.env.BASE_URL;

router.post("/upload", (req, res) => {
  upload(req, res, async () => {
    try {
      if (!req.file) {
        return res.status(404).json({ err: "File not detected" });
      }
      const file = new File({
        fileName: req.file.filename,
        uuid: uuidv4(),
        path: req.file.path,
        size: req.file.size,
      });
      const savedFile = await file.save();
      return res.status(200).json({
        file: `${BASE_URL}/api/pages/download-page/${savedFile.uuid}`,
      });
    } catch (error) {
      console.log(error);
    }
  });
});

router.post("/send", async (req, res) => {
  try {
    const { uuid, receiverEmail, senderEmail: sendersEmail } = req.body;
    if (!(uuid && receiverEmail && sendersEmail)) {
      res.status(400).json({ err: "All field are required" });
    }
    const foundFile = await File.findOne({
      uuid,
    });

    foundFile.sender = sendersEmail;
    foundFile.receiver = receiverEmail;

    await sendEmail({
      from: sendersEmail,
      to: receiverEmail,
      subject: "File Share with You",
      Text: `${sendersEmail} shared a file with you`,
      html: emailTemplate({
        emailFrom: sendersEmail,
        downloadLink: `${BASE_URL}/api/pages/download-page/${foundFile.uuid}`,
        size: parseInt(foundFile.size / 1000) + "KB",
        expires: "24 Hours",
      }),
    });
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

module.exports = router;
