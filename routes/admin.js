const express = require("express");
const {
  isLoggedIn,
  isLoggedInAdmin,
} = require("../config/middleware/userAuth");

const Post = require("../model/Post");
const Topic = require("../model/Topic");
const router = new express.Router();

router.post("/topic", isLoggedInAdmin, async (req, res) => {
  const curDate = new Date().toISOString().slice(0, 10);
  const { topic, description } = req.body;
  const newTopic = new Topic({
    topic,
    description,
    created_at: curDate,
    created_user: req.auth.id,
  });
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
router.delete("/topic/:id", isLoggedInAdmin, async (req, res) => {
  console.log("tocuhed: ", req.params);
  const { id } = req.params;

  try {
    const deleteTopic = await Topic.findOneAndDelete({ _id: id });
    console.log(deleteTopic);
    if (!deleteTopic) {
      return res.status(404).send({ msg: "No topic to Delete" });
    }
    const deleteManyPost = await Post.deleteMany({
      postType: { $exist: fale },
    });
    console.log(deleteManyPost);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
