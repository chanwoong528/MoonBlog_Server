const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../model/User");

const { isLoggedIn } = require("../config/middleware/userAuth");

const router = new express.Router();

//generate New accToken based on refToken
router.post("/token", async (req, res) => {
  const { refToken } = req.body;
  // console.log("/token [req.body]: ", refToken);
  if (!refToken) {
    return res.status(401).send({ msg: "No Token Containing" });
  } else {
    jwt.verify(refToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .send({ isLoggedIn: false, message: "Failed To Verify User" });
      } else {
        const newAccToken = jwt.sign(
          { id: decoded.id, admin: decoded.admin },
          process.env.JWT_SECRET,
          {
            expiresIn: 5,
          }
        );
        return res.status(201).send({ accToken: newAccToken });
      }
    });
  }
});

//Login Get
router.get("/", isLoggedIn, async (req, res) => {
  const targetUser = await User.findById(req.auth.id);
  const loggedInUser = {
    id: targetUser._id.toString(),
    email: targetUser.email,
    name: targetUser.name,
    admin: targetUser.admin,
  };

  return res.status(200).send({ isLoggedIn: true, user: loggedInUser });
});

//Login Post
router.post("/", async (req, res) => {
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
        admin: targetUser.admin,
      };
      const accToken = jwt.sign(
        { id: user.id, admin: user.admin },
        process.env.JWT_SECRET,
        {
          expiresIn: 5,
        }
      );
      const refToken = jwt.sign(
        { id: user.id, admin: user.admin },
        process.env.JWT_SECRET
      );
      return res
        .status(200)
        .send({ isLoggedIn: true, accToken, refToken, user });
    } else {
      return res.status(401).send({ msg: "Check your Email or Password" });
    }
  }
});

module.exports = router;
