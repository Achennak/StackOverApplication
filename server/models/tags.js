const mongoose = require("mongoose");
const tagSchema = require("./schema/tag");

const Tag = mongoose.model("Tag", tagSchema);

module.exports = Tag;
