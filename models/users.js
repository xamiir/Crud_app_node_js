const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,

    unique: true,
  },
  image: {
    type: String,
    required: true,
  },
  creatredAt: {
    type: Date,
    requare: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
