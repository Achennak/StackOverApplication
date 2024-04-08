var mongoose = require("mongoose");

// Schema for questions
const questionSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    tagIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag", required: true }],
    answerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    creationDate: { type: Date, default: Date.now },
    likes: { type: Number, Default: 0 },
    views: { type: Number, default: 0 },
  },

  { collection: "Question" }
);

module.exports = questionSchema;
