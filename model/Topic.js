const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
  topic: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  created_at: { type: String, required: true },
  created_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});
module.exports = mongoose.model("Topic", topicSchema);
