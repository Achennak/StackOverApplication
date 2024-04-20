const express = require("express");
const Question = require("../models/question");
const authenticateToken = require("./authentication_middleware");
const {
  addTag,
  getQuestionsByOrder,
  filterQuestionsBySearch,
} = require("../utils/question");

const router = express.Router();

router.get("/getQuestionsByUserId/:userId", async (req, res) => {
  const userId = req.params.userId;
  console.log("getQuestionsByUserId/", userId);
  try {
    const questions = await Question.find({ createdBy: userId })
      .populate("tagIds")
      .populate("createdBy")
      .exec();
    console.log(questions);

    res.json(questions);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// To get Questions by Filter
const getQuestionsByFilter = async (req, res) => {
  try {
    const { order, search } = req.query;
    console.log(order);
    console.log(search);

    // Fetch questions by order
    let orderedQuestions = await getQuestionsByOrder(order);
    console.log("ordered questions ", orderedQuestions);

    // Filter questions by search
    const filteredQuestions = await filterQuestionsBySearch(
      orderedQuestions,
      search
    );
    console.log("filtered questions ", filteredQuestions);

    res.json(filteredQuestions);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// To get Questions by Id
const getQuestionById = async (req, res) => {
  try {
    const { qid } = req.params;

    if (qid === null) {
      return res.status(500).json({ error: "Internal server error" });
    }
    console.log("questionid", qid);
    const question = await Question.findOneAndUpdate(
      { _id: qid },
      { $inc: { views: 1 } },
      { new: true }
    ).populate("answerIds");
    console.log(question);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }
    res.json(question);
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
    console.log(newQuestion);
    res.status(200).json(newQuestion);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate("tagIds", "tagName")
      .populate("createdBy", "username")
      .lean();

    const formattedQuestions = questions.map((question) => {
      const tags = question.tagIds.map((tag) => tag.tagName);
      // eslint-disable-next-line no-unused-vars
      const { tagIds, ...rest } = question;
      return { ...rest, tags };
    });

    res.json(formattedQuestions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Like a question
router.post("/like/:questionId", authenticateToken, async (req, res) => {
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
});

// Dislike a question
router.post("/dislike/:questionId", authenticateToken, async (req, res) => {
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
});

router.get("/getQuestion", getQuestionsByFilter);
router.get("/getQuestionById/:qid", getQuestionById);
router.post("/addQuestion", authenticateToken, addQuestion);
router.get("/getAllQuestions", authenticateToken, getAllQuestions);

module.exports = router;
