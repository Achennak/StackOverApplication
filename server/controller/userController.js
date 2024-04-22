const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();

router.get("/details/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch user details from the database using the userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user details
    res.json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create a new user
    const newUser = new User({
      userName: username,
      email,
      password: hashedPassword,
      isAdmin: false,
    });

    await newUser.save();
    const token = jwt.sign({ userId: newUser._id }, "random_key");
    return res.status(201).json({ token });
  } catch (error) {
    console.error("Error signing up:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordSame = await bcrypt.compare(password, user.password);
    if (!isPasswordSame) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, "random_key");

    res.json({ token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
