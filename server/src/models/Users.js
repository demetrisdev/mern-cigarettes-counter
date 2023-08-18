const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  savedCigarettes: [{ type: mongoose.Schema.Types.ObjectId, ref: "NewPackage" }],
});

const UserModel = mongoose.model("users", UserSchema);

module.exports = { UserModel };