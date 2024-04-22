const express = require("express");
const Question = require("../models/question");
const User = require("../models/user");
const authenticateToken = require("./authentication_middleware");
const {
  addTag,
  getQuestionsByOrder,
  filterQuestionsBySearch,
} = require("../utils/question");

const router = express.Router();

const getQuestionsForUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const questions = await Question.find({ createdBy: userId })
      .populate("createdBy")
      .exec();
    console.log(questions);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// To get Questions by Filter
const getQuestionsByFilter = async (req, res) => {
  try {
    const { order, search } = req.query;

    // Fetch questions by order
    let orderedQuestions = await getQuestionsByOrder(order);

    // Filter questions by search
    const filteredQuestions = await filterQuestionsBySearch(
      orderedQuestions,
      search
    );

    res.json(filteredQuestions);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// To add Question
const addQuestion = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(500).json({ error: "Unauthorized" });
    }
    let { title, text, tagIds, answerIds } = req.body;

    // Set default values if parameters are undefined
    if (title === undefined) title = "Default Title";
    if (text === undefined) text = "Default Text";
    if (tagIds === undefined) tagIds = [];
    if (answerIds === undefined) answerIds = [];

    const userId = req.user.userId;
    // Add tags
    const rtagIds = [];
    for (const tagName of tagIds) {
      const tagId = await addTag(tagName);
      rtagIds.push(tagId);
    }
    // Create new question
    const newQuestion = await Question.create({
      title,
      text,
      tagIds: rtagIds,
      answerIds: answerIds,
      createdBy: userId,
      creationDate: new Date(),
      views: 0,
    });
    res.status(200).json(newQuestion);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
// Like a question
const likeQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { userId } = req.body;
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    if (question.likedBy.includes(userId)) {
      return res
        .status(400)
        .json({ error: "Question already liked by this user" });
    }

    question.likedBy.push(userId);
    await question.save();

    res.status(200).json({ message: "Question liked successfully" });
  } catch (error) {
    console.error("Like question error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Dislike a question
const dislikeQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { userId } = req.body;
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    const userIndex = question.likedBy.indexOf(userId);
    if (userIndex === -1) {
      return res.status(400).json({ error: "Question not liked by this user" });
    }

    question.likedBy.splice(userIndex, 1);
    await question.save();

    res.status(200).json({ message: "Question disliked successfully" });
  } catch (error) {
    console.error("Dislike question error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a question
const deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const userId = req.user.userId;
    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(403).json({ error: "Invalid User" });
    }

    if (user._id.equals(question.createdBy) || user.isAdmin) {
      await question.deleteOne();

      res.status(200).json({ message: "Question deleted successfully" });
    } else {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this question" });
    }
  } catch (error) {
    console.error("Delete question error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

router.post("/like/:questionId", authenticateToken, likeQuestion);
router.get(
  "/getQuestionsByUserId/:userId",
  authenticateToken,
  getQuestionsForUser
);
router.post("/dislike/:questionId", authenticateToken, dislikeQuestion);
router.delete("/:questionId", authenticateToken, deleteQuestion);
router.get("/getQuestion", authenticateToken, getQuestionsByFilter);
router.post("/addQuestion", authenticateToken, addQuestion);

module.exports = router;
