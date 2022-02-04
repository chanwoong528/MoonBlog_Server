const express = require("express");
const { isLoggedIn } = require("../config/middleware/userAuth");
const Comment = require("../model/Comment");
const Post = require("../model/Post");
const router = new express.Router();

//create comment
router.post("/:postId", isLoggedIn, async (req, res) => {
  const create_at = new Date().toISOString();
  const update_at = new Date().toISOString();
  const content = req.body.commentBody;
  const postId = req.params.postId;
  const userId = req.auth.id;

  if (content.length > 150) {
    return res.status(413).send({ msg: "Unable to create Comment Too long!" });
  }
  try {
    const newComment = new Comment({
      content,
      postId,
      author: userId,
      create_at,
      update_at,
    });
    await newComment.save();
    const updatePost = await Post.findByIdAndUpdate(postId, {
      $push: { comments: newComment._id },
    });
    return res
      .status(200)
      .send({ msg: "Comment Created!", comment: newComment });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ msg: "Unable to create Comment" });
  }
});

module.exports = router;
