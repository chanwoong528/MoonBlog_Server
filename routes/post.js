const express = require("express");
const Post = require("../model/Post");
const router = new express.Router();

router.post("/", async (req, res) => {
  const user = "Moon";
  const { title, body } = req.body;
  const createdDate = new Date().toISOString();
  const newPost = new Post({
    title,
    body,
    author: user,
    create_at: createdDate,
  });
  await newPost.save((err) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ msg: "Unable to create Post" });
    } else {
      return res.status(200).send({ msg: "Post Created!" });
    }
  });
});
router.get("/", async (req, res) => {
  const posts = await Post.find({});
  console.log(posts);
  if (posts) {
    res.status(200).send({ msg: "Successful to get Posts", posts });
  }
});

module.exports = router;
