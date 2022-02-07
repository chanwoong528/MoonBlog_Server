const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../model/User");
const router = new express.Router();

router.post("/", async (req, res) => {
  console.log("Register User:", req.body);
  const { email, name } = req.body;
  const salt = await bcrypt.genSalt(10); // have to hide this
  const password = await bcrypt.hash(req.body.password, salt);
  const curDate = new Date().toISOString().slice(0, 10);

  const newUser = new User({
    email,
    name,
    password,
    create_at: curDate,
    update_at: curDate,
  });
  await newUser.save((err) => {
    if (err) {
      console.log(err.code);
      if (err.code === 11000) {
        //Unique Key Violation.
        return res.status(400).send({ msg: "User Already Exist with Email" });
      }
      return res.status(500).send({ msg: "Unable to create User" });
    } else {
      return res.status(200).send({ msg: "User Created!", user: newUser });
    }
  });
});

module.exports = router;
