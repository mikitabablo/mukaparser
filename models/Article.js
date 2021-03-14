const mongoose = require("mongoose");

const articleSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: false,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: false,
    default: null,
  },
});

module.exports = mongoose.model("article", articleSchema);
