const express = require("express");
const Tag = require("../models/tags");
const Question = require("../models/question");

const router = express.Router();

const getTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    console.log(tags);
    res.status(200).json(tags);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
router.get("/getAllTags", getTags);

module.exports = router;
