const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fName: String,
  email: String,
  password: String,
  role: String,
  phone: String,   
  image: String,
  verified: { type: Boolean, default: false },
  verificationToken: { type: String },
});

module.exports = mongoose.model("User", UserSchema);
