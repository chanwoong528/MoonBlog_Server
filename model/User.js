const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  create_at: { type: String, required: true },
  update_at: { type: String, required: true },
  forgotPWStat: { type: Boolean, required: true, default: false },
  admin: { type: Boolean, required: true, default: false },
});
module.exports = mongoose.model("User", userSchema);
