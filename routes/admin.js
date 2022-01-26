const express = require("express");
const Menu = require("../model/Menu");
const Topic = require("../model/Topic");
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

router.post("/topic", async (req, res) => {
  const curDate = new Date().toISOString().slice(0, 10);
  const { topic, description } = req.body;
  console.log(req.body);
  console.log(curDate);
  const newTopic = new Topic({ topic, description, created_at: curDate });
  await newTopic.save((err) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ msg: "Unable to create Topic" });
    } else {
      return res.status(201).send({ msg: "Topic Created!" });
    }
  });
});
router.get("/topic", async (req, res) => {
  const topics = await Topic.find({});
  if (topics) {
    res.status(200).send({ msg: "Successful to get topics", topics });
  }
});

module.exports = router;
