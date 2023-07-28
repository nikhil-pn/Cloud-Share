//installize express
const express = require("express");
const scheduler = require("node-cron");
const path = require("path");
//connect DB
const connectDB = require("./config/db");
const { fetchAndDeleteData } = require("./services/fileCleaner");
require("dotenv").config;

//initialize port and express server
const PORT = process.env.PORT || 3001;
const app = express();
connectDB();

//adding node corn and schedulecing to deleted files after 12 hours
scheduler.schedule("00 12 * * *", () => fetchAndDeleteData());

// Templating Engine
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

// Middlewares
app.use(express.json());
app.use(express.static("public"));
if (process.env.NODE_ENV === "DEV") {
  const morgan = require("morgan");
  app.use(morgan("tiny"));
}

// Routes
app.get("/", (_req, res) => {
  res.sendFile("index.html", { root: path.join(__dirname, "public") });
});
app.use("/api/files", require("./routes/files"));
app.use("/api/pages", require("./routes/pages"));
app.all("*", (_req, res) => {
  return res
    .status(404)
    .sendFile("404.html", { root: path.join(__dirname, "public") });
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
