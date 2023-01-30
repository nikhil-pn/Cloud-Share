// const express = require("express");
// const scheduler = require("node-cron");
// const path = require("path");
// const connectDB = require("./config/db");
// const { fetchAndDeleteData } = require("./services/fileCleaner");

// const filesRoutes = require("./routes/files");
// const pageRoutes = require("./routes/pages");

// require("dotenv").config();

// const PORT = process.env.PORT;
// const app = express();
// connectDB();

// scheduler.schedule("0 12 * * *", () => fetchAndDeleteData());

// app.set("views", path.join(__dirname, "/views"));
// app.set("view engine", "ejs");

// //middlewares
// app.use(express.json());
// app.use(express.static("public"));

// app.get("/", (req, res) => {
//   res.sendFile("index.html", { root: path.join(__dirname, "public") });
// });
// app.use("/api/files", filesRoutes);
// app.use("/api/pages", pageRoutes);

// // sending 404 error if page not found, please not when using 404 use middle at last
// app.all("*", (req, res) => {
//   return res
//     .status(404)
//     .sendFile("404.html", { root: path.join(__dirname, "public") });
// });

// app.listen(PORT, () => {
//   console.log("Server is Running at PORT ", PORT);
// });

const express = require("express");
const scheduler = require("node-cron");
const path = require("path");
const connectDB = require("./config/db");
const { fetchAndDeleteData } = require("./services/fileCleaner");
require("dotenv").config;

const PORT = process.env.PORT || 3001;
const app = express();
connectDB();

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
