const mongoose = require("mongoose");

//schema for tags
const tagSchema = mongoose.Schema(
  {
    tagName: { type: String, required: true },
  },
  { collection: "Tag" }
);

module.exports = tagSchema;
