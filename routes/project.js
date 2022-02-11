const express = require("express");
const Post = require("../model/Post");

const {
  isLoggedIn,
  isLoggedInAdmin,
} = require("../config/middleware/userAuth");

const router = new express.Router();

module.exports = router;
