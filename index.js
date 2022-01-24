require("dotenv").config({ path: "./env/.env" });
const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");

//Routes
const postRoute = require("./routes/post");
const adminRoute = require("./routes/admin");

//Routes
const app = express();
const PORT = process.env.PORT || 5002;

app.use(express.static("public"));

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    methods: ["HEAD", "POST", "PUT", "GET", "PATCH", "DELETE"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//=========================Routes=======================
app.use("/post", postRoute);
app.use("/admin", adminRoute);
//=========================Routes=======================
//DB Connection
const db = mongoose.connection;
db.once("open", function () {
  console.log("MongoDB connected");
});
db.on("error", function (err) {
  console.log("MongoDB ERROR: ", err);
});

//Server Up
app.listen(PORT, (err) => {
  if (err) console.log(`Unable to run Server on ${PORT}=> ${err}`);
  else console.log(`Server Up: ${PORT}`);
});
