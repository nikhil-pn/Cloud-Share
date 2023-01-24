const express = require("express");
const scheduler = require("node-cron");
const path = require("path");
const connectDB = require("./config/db");
const { fetchAndDeleteData } = require("./services/fileCleaner");

const filesRoutes = require("./routes/filesRoutes");
const pageRoutes = require("./routes/pagesRoutes");

require("dotenv").config();

const PORT = 3001;
const app = express();
connectDB();

scheduler.schedule("00, 12 * * *", () => fetchAndDeleteData());

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

//middlewares
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: path.join(__dirname, "public") });
});
app.use("api/v1/files", filesRoutes);
app.use("/api/v1/pages", pageRoutes);

//sending 404 error if page not found, please not when using 404 use middle at last
app.all("*", (req, res) => {
  return res
    .status(404)
    .sendFile("404.html", { root: path.join(__dirname, "public") });
});

app.listen(PORT, () => {
  console.log("Server is Running at PORT ", PORT);
});
