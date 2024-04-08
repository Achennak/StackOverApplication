const mongoose = require("mongoose");
const answerSchema = require("./schema/answer");

const Answer = mongoose.model("Answer", answerSchema);

module.exports = Answer;
