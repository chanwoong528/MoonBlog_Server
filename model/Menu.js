const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  url: { type: String, required: true, unique: true },
  auth: { type: String, required: true },
});
module.exports = mongoose.model("Menu", menuSchema);
