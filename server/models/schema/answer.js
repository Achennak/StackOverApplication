const mongoose = require("mongoose");

// Schema for answers
const answerSchema = mongoose.Schema(
  {
    text: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    likes: { type: Number, Default: 0 },
    creationDate: { type: Date, default: Date.now },
  },
  { collection: "Answer" }
);
module.exports = answerSchema;
