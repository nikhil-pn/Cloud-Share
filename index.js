const express = require("express");
const scheduler = require("node-cron");
const path = require("path");
const connectDB = require("./config/db");
const { fetchAndDeleteData } = require("./services/fileCleaner");

const filesRoutes = require("./routes/filesRoutes")

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
app.use("api/v1/files", filesRoutes)
app.use("/api/v1/pages", )
