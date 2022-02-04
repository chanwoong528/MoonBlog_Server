const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", require: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
  create_at: { type: String, required: true },
  update_at: { type: String, required: true },
});
module.exports = mongoose.model("Comment", commentSchema);
