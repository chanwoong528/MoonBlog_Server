const express = require("express");

const Post = require("../model/Post");

const {
  isLoggedIn,
  isLoggedInAdmin,
} = require("../config/middleware/userAuth");

const router = new express.Router();

//endpoint with "/post"

router.post("/", isLoggedInAdmin, async (req, res) => {
  const { id } = req.auth;
  console.log(req.auth);

  const { title, body, postType } = req.body;
  const createdDate = new Date().toISOString();
  const newPost = new Post({
    title,
    body,
    author: id,
    create_at: createdDate,
    postType,
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
  // console.log(posts);
  if (posts) {
    return res.status(200).send({ msg: "Successful to get Posts", posts });
  }
});
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (post) {
    return res.status(200).send({ msg: "Successful to get Post", post });
  } else {
    return res.status(404).send({ msg: "no Post Found" });
  }
});

module.exports = router;
