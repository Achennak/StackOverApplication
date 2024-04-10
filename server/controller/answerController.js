const express = require("express");
const Answer = require("../models/answer");
const Question = require("../models/question");
const authenticateToken = require("./authentication_middleware");

const router = express.Router();

// Adding answer
const addAnswer = async (req, res) => {
  try {
    const { qid, ans } = req.body;

    const userId = req.user._id;

    // Create a new answer
    const newAnswer = await Answer.create({
      text: ans.text,
      userId: userId,
      likes: 0,
      creationDate: ans.creationDate || Date.now(),
    });

    // Update the question document to add the new answer ID
    const updatedQuestion = await Question.findOneAndUpdate(
      { _id: qid },
      { $push: { answers: { $each: [newAnswer._id], $position: 0 } } },
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

router.post("/addAnswer", authenticateToken, addAnswer);

module.exports = router;
