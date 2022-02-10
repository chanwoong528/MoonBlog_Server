const express = require("express");
const {
  isLoggedIn,
  isLoggedInAdmin,
} = require("../config/middleware/userAuth");
const router = new express.Router();

router.post("/", async (req, res) => {
  console.log(req.body);
});

module.exports = router;
