const express = require("express");
const Tag = require("../models/tags");
const Question = require("../models/question");

const router = express.Router();

const getTagsWithQuestionNumber = async (req, res) => {
  try {
    // Retrieve tags
    const tags = await Tag.find();

    const questions = await Question.find().populate("tagIds");
    // Count the number of questions for each tag
    const tagsWithQuestionNumber = tags.map((tag) => {
      const qcnt = questions.filter((question) =>
        question.tagIds.some((t) => t.tagName === tag.tagName)
      ).length;
      return { tagName: tag.tagName, qcnt };
    });

    res.status(200).json(tagsWithQuestionNumber);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTags = async (req, res) => {
  try {
    const tags = await Tag.find();

    res.status(200).json(tags);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
router.get("/getTagsWithQuestionNumber", getTagsWithQuestionNumber);
router.get("/getAllTags", getTags);

module.exports = router;
