const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  postType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Topic",
    require: true,
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
  create_at: { type: String, required: true },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});
module.exports = mongoose.model("Post", postSchema);
