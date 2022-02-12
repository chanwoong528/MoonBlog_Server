require("dotenv").config({ path: "./env/.env" });
const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
//Routes
const userRoute = require("./routes/user");
const postRoute = require("./routes/post");
const adminRoute = require("./routes/admin");
const authRoute = require("./routes/auth");
const commentRoute = require("./routes/comment");
const fileRoute = require("./routes/file");
const projectRoute = require("./routes/project");
//Routes
const app = express();
const PORT = process.env.PORT || 5002;

app.use(express.static("public"));

app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "http://localhost:3000",
      "https://moonblogjs.netlify.app",
    ],
    credentials: true,
    methods: ["HEAD", "POST", "PUT", "GET", "PATCH", "DELETE"],
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

//=======test build=====
// app.use(express.static(path.resolve(__dirname, "./build")));
// app.get("/", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "./build", "index.html"));
// });
//=======test build=====
//=========================Routes=======================
https: app.use("/user", userRoute);
app.use("/post", postRoute);
app.use("/admin", adminRoute);
app.use("/auth", authRoute);
app.use("/comment", commentRoute);
app.use("/file", fileRoute);
app.use("/project", projectRoute);
//=========================Routes=======================

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", function () {
  console.log("MongoDB connected");
});
db.on("error", function (err) {
  console.log("MongoDB ERROR: ", err);
});

//Server Up
app.listen(PORT, (err) => {
  if (err) {
    console.log(`Unable to run Server on ${PORT}=> ${err}`);
  } else {
    console.log(`Server Up: ${PORT}`);
  }
});
