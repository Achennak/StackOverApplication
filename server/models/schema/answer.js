const mongoose = require("mongoose");

// Schema for answers
const answerSchema = mongoose.Schema(
  {
    text: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    likedBy:[{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    creationDate: { type: Date, default: Date.now },
  },
  { collection: "Answer" }
);
module.exports = answerSchema;
