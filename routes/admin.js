const express = require("express");
const Menu = require("../model/Menu");
const router = new express.Router();

router.post("/menu", async (req, res) => {
  const { name, url, auth } = req.body;
  const newMenu = new Menu({ name, url, auth });
  await newMenu.save((err) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ msg: "Unable to create Menu" });
    } else {
      return res.status(201).send({ msg: "Menu Created!" });
    }
  });
});
router.get("/menu", async (req, res) => {
  const menus = await Menu.find({});
  console.log(menus);
  if (menus) {
    res.status(200).send({ msg: "Successful to get Menus", menus });
  }
});

module.exports = router;
