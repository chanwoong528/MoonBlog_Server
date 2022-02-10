const express = require("express");
const { isLoggedIn } = require("../config/middleware/userAuth");
const Comment = require("../model/Comment");
const mongoose = require("mongoose");

const Post = require("../model/Post");

const router = new express.Router();

//create comment
router.post("/:postId", isLoggedIn, async (req, res) => {
  const create_at = new Date().toISOString();
  const update_at = new Date().toISOString();
  const content = req.body.commentBody;
  const postId = req.params.postId;
  const userId = req.auth.id;

  if (content.length > 500) {
    return res.status(413).send({ msg: "Unable to create Comment Too long!" });
  }
  if (content.length < 1) {
    return res.status(413).send({ msg: "Unable to create Comment Too Short!" });
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
router.delete("/:postId/:commentId", isLoggedIn, async (req, res) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;
  const userId = req.auth.id;
  //TODO: Winston Logger;
  try {
    const deleteComment = await Comment.findOneAndDelete({
      _id: commentId,
      author: userId,
    });

    if (!deleteComment) {
      return res.status(404).send({ msg: "No Comment Found" });
    }
    const targetPost = await Post.findByIdAndUpdate(postId, {
      $pull: { comments: commentId },
    });
    if (!targetPost) {
      return res.status(404).send({ msg: "No post Found" });
    }
    return res.status(202).send({ msg: "Comment Deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ msg: "Unable to delete Comment" });
  }
});

module.exports = router;
