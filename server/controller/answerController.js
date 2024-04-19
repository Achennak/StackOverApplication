const express = require("express");
const Answer = require("../models/answer");
const Question = require("../models/question");
const authenticateToken = require("./authentication_middleware");

const router = express.Router();

const getAnswersForUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const answers = await Answer.find({ createdBy: userId })
      .populate("createdBy")
      .exec();
    res.json(answers);
  } catch (error) {
    console.error("Error fetching answers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Adding answer
const addAnswer = async (req, res) => {
  try {
    const { qid, ans } = req.body;

    const userId = req.user._id;

    // Create a new answer
    const newAnswer = await Answer.create({
      text: ans.text,
      createdBy: userId,
    });

    // Update the question document to add the new answer ID
    const updatedQuestion = await Question.findOneAndUpdate(
      { _id: qid },
      { $push: { answerIds: { $each: [newAnswer._id], $position: 0 } } },
      { new: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ error: "Question not found" });
    }
    console.log(newAnswer);
    res.status(200).json(newAnswer);
  } catch (error) {
    console.error("Error adding answer:", error);
    res.status(500).json({ error: "Failed to add answer" });
  }
};
// Fetch all answers for a question
const getAnswersForQuestion = async (req, res) => {
  try {
    const questionId = req.params.questionId;

    // Find the question and populate its answerIds to get all answers
    const question = await Question.findById(questionId).populate("answerIds");
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    const answers = question.answerIds;
    res.status(200).json(answers);
  } catch (error) {
    console.error("Error fetching answers for question:", error);
    res.status(500).json({ error: "Failed to fetch answers for question" });
  }
};

// Liking an answer
const likeAnswer = async (req, res) => {
  try {
    const answerId = req.params.answerId;
    const userId = req.user._id;
    const answer = await Answer.findById(answerId);

    if (!answer) {
      return res.status(404).json({ error: "Answer not found" });
    }

    if (!answer.likedBy.includes(userId)) {
      answer.likedBy.push(userId);
      await answer.save();
    }

    res.status(200).json(answer);
  } catch (error) {
    console.error("Error liking answer:", error);
    res.status(500).json({ error: "Failed to like answer" });
  }
};

// Disliking an answer
const dislikeAnswer = async (req, res) => {
  try {
    const answerId = req.params.answerId;
    const userId = req.user._id;
    const answer = await Answer.findById(answerId);

    if (!answer) {
      return res.status(404).json({ error: "Answer not found" });
    }

    const index = answer.likedBy.indexOf(userId);
    if (index > -1) {
      answer.likedBy.splice(index, 1);
      await answer.save();
    }

    res.status(200).json(answer);
  } catch (error) {
    console.error("Error disliking answer:", error);
    res.status(500).json({ error: "Failed to dislike answer" });
  }
};

// Deleting an answer
const deleteAnswer = async (req, res) => {
  try {
    const answerId = req.params.answerId;
    const userId = req.user._id;
    const answer = await Answer.findOneAndDelete({
      _id: answerId,
      createdBy: userId,
    });

    if (!answer) {
      return res.status(404).json({
        error:
          "Answer not found or you are not authorized to delete this answer",
      });
    }

    // Remove answer ID from the question
    await Question.updateOne(
      { _id: answer.questionId },
      { $pull: { answerIds: answer._id } }
    );

    res.status(200).json({ message: "Answer deleted successfully" });
  } catch (error) {
    console.error("Error deleting answer:", error);
    res.status(500).json({ error: "Failed to delete answer" });
  }
};

router.get("/getAnswersByUserId/:userId", authenticateToken, getAnswersForUser);
router.delete("/:answerId", authenticateToken, deleteAnswer);
router.get(
  "/getAnswersForQuestion/:questionId",
  authenticateToken,
  getAnswersForQuestion
);
router.put("/:answerId/dislike", authenticateToken, dislikeAnswer);
router.put("/:answerId/like", authenticateToken, likeAnswer);

router.post("/addAnswer", authenticateToken, addAnswer);

module.exports = router;
