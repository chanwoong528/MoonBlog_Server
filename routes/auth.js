const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../model/User");

const router = new express.Router();
//verifyJWT
const verifyJWT = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).send({ msg: "No Token Containing" });
  } else {
    jwt.verify(token, "moonblogSecret", (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .send({ isLoggedIn: false, msg: "Failed To Verify User" });
      } else {
        req.userId = decoded.user.id;
        next();
      }
    });
  }
};

//Login Get
router.get("/", verifyJWT, async (req, res) => {
  res.status(200).send({ msg: "Login Successful" });
});

//Login Post
router.post("/", async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  const targetUser = await User.findOne({ email: email });
  if (!targetUser) {
    return res.status(404).send({ msg: "Check your Email or Password" });
  } else {
    const comparePW = await bcrypt.compare(password, targetUser.password);
    if (comparePW) {
      const user = {
        id: targetUser._id.toString(),
        email: targetUser.email,
        name: targetUser.name,
      };
      const token = jwt.sign({ user }, "moonblogSecret", { expiresIn: 300 });
      return res.status(200).send({ isLoggedIn: true, token, user });
    } else {
      return res.status(401).send({ msg: "Check your Email or Password" });
    }
  }
});

module.exports = router;
