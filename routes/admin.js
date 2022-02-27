const express = require("express");
const {
  isLoggedIn,
  isLoggedInAdmin,
} = require("../config/middleware/userAuth");
const Comment = require("../model/Comment");

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
      return res.status(201).send({ msg: "Topic Created!", newTopic });
    }
  });
});
router.patch("/topic/:id", isLoggedInAdmin, async (req, res) => {
  const { id } = req.params;
  const { newTitle, newDesc } = req.body;
  try {
    const updateTopic = await Topic.findByIdAndUpdate(id, {
      topic: newTitle,
      description: newDesc,
    });
    if (!updateTopic) {
      return res.status(404).send({ msg: "Target Topic to update not found" });
    }
    return res.status(200).send({
      msg: "Update Topic Successful",
      topic: newTitle,
      description: newDesc,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ msg: "Uable to Update Topic. " });
  }
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
    // console.log(deleteTopic);
    if (!deleteTopic) {
      return res.status(404).send({ msg: "No topic to Delete" });
    }
    const deleteResult = await DeleteAllPosts(id);
    // console.log(deleteResult);
    return res
      .status(200)
      .send({ msg: "Delete Done [topic, posts, comments]" });
  } catch (error) {
    console.log(error);
    return res
      .send(500)
      .send({ msg: "Unable to Delete [topic, posts, comments]" });
  }
});
//to be Moved to repository
async function DeleteAllPosts(topicId) {
  try {
    const posts = await Post.find({ postType: topicId });
    const deleteManyPost = await Post.deleteMany({
      postType: topicId,
    });
    posts.forEach(async (post) => {
      await deleteAllComments(post._id);
    });
    return deleteManyPost;
  } catch (error) {
    console.log(error);
    return new Error("Unable to Delete Posts");
  }
}
//to be Moved to repository
async function deleteAllComments(postId) {
  try {
    const deleteManyComments = await Comment.deleteMany({ postId });
    return deleteManyComments;
  } catch (error) {
    console.log(error);
    return new Error("Unable to Delete Comments");
  }
}
module.exports = router;
