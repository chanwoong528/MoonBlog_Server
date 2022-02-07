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
  const { title, body, postType } = req.body;
  //postType = postType._id[Client]
  const createdDate = new Date().toISOString();
  console.log(postType);
  if (postType === "0") {
    return res
      .status(400)
      .send({ msg: "Unable to create Post with postType = 0" });
  }
  try {
    const newPost = new Post({
      title,
      body,
      author: id,
      create_at: createdDate,
      postType,
    });
    await newPost.save();
    return res.status(200).send({ msg: "Post Created!" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ msg: "Unable to create Post" });
  }
});
router.delete("/:postId", isLoggedInAdmin, async (req, res) => {
  const postId = req.params.postId;
  try {
    const deletePost = await Post.findByIdAndDelete(postId);
    if (!deletePost) {
      //TODO: Winston Logger;
      return res.status(404).send({ msg: "No post to Delete" });
    }
    return res.status(201).send({ msg: "Delete post Successful" });
  } catch (error) {
    return res.status(500).send({ msg: "Unable to Delete Post" });
  }
});
router.patch("/:postId", isLoggedInAdmin, async (req, res) => {
  const postId = req.params.postId;
  const body = req.body.body;

  try {
    const updatePost = await Post.findByIdAndUpdate(postId, { body: body });
    if (!updatePost) {
      return res.status(404).send({ msg: "Target Post to update not found" });
    }
    //TODO: winston Logger

    return res.status(201).send({ msg: "Update Post Successful", body: body });
  } catch (error) {
    return res.status(500).send({ msg: "Unable to Update Post" });
  }
});
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({});
    // console.log(posts);
    if (posts.length > 0) {
      return res.status(200).send({ msg: "Successful to get Posts", posts });
    } else {
      return res.status(404).send({ msg: "no Post Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ msg: "Unable to get Post" });
  }
});
//SinglePost with comments
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id).populate({
      path: "comments",
      populate: [{ path: "author", select: "name email" }],
    });
    if (post) {
      return res.status(200).send({ msg: "Successful to get Post", post });
    } else {
      return res.status(404).send({ msg: "no Post Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ msg: "Unable to get Post" });
  }
});
router.patch("/views/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findByIdAndUpdate(
      { _id: id },
      { $inc: { views: 1 } }
    );
    return res.status(200).send({ msg: "Incremented views" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ msg: "Unable to Increament Views" });
  }
});

module.exports = router;
