const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  profession: { type: String, required: true },
  password: { type: String, required: true },
});

module.exports = model("Users", userSchema);
