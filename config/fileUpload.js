const multer = require("multer");

//storing the files inside multer with appending currrent date
let fileStorage = multer.diskStorage({
  destination: (req, file, cb) => (null, "uploads/"),
  filename: (req, file, cb) => {
    const uniquieName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniquieName);
  },
});
let upload = multer({
  storage: fileStorage,
  limits: { fileSize: 10 ** 7 },
}).single("uploadedFile");

module.exports = upload;
