const mongoose = require("mongoose");
const questionSchema = require("./schema/question");

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
