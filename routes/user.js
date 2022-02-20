const express = require("express");
const { sendResetPWEmail } = require("../config/email/sendGrid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
      console.log(err);
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
//forgot password send email to reset password
router.post("/pw", async (req, res) => {
  console.log(req.body); //email
  const { email } = req.body;
  try {
    //1. check if email exist in DB
    const targetUser = await User.findOneAndUpdate(
      { email: email },
      { $set: { forgotPWStat: true } }
    );
    if (!targetUser) {
      return res
        .status(404)
        .send({ msg: `Cannot find user with Email:${email}` });
    } else {
      //2. if Email, then generate token and send it as email.
      const resetToken = jwt.sign(
        { id: targetUser._id.toString() },
        process.env.JWT_SECRET,
        {
          expiresIn: 300,
        }
      );
      await sendResetPWEmail(targetUser.email, resetToken);
      return res.status(200).send("Email has been sent, Check your Email");
    }
  } catch (error) {
    console.log(error);
  }
});
//reset Password by see the token if it verifies then reset password;
router.patch("/pw/:token", async (req, res) => {
  const { token } = req.params;
  const { passwordConf } = req.body;
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);
  const curDate = new Date().toISOString().slice(0, 10);
  // if(password!==passwordConf){}
  jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
    if (err) {
      console.log(err);
      return res
        .status(401)
        .send({ msg: "Unable to Update new Password. Try again." });
    } else {
      try {
        const targetUser = await User.findById(decode.id);
        if (!targetUser.forgotPWStat) {
          return res.status(402).send({
            msg: "You have already changed password, If you still did not reset your password, try from beginning.",
          });
        } else {
          const updateUser = await User.findByIdAndUpdate(decode.id, {
            password: password,
            update_at: curDate,
            forgotPWStat: false,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  });
});

module.exports = router;
