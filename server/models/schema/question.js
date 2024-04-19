var mongoose = require("mongoose");

// Schema for questions
const questionSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    tagIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag", required: true }],
    answerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    creationDate: { type: Date, default: Date.now },
    likedBy:[{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    views: { type: Number, default: 0 },
  },

  { collection: "Question" }
);

module.exports = questionSchema;
