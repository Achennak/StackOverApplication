const express = require("express");
const authenticateToken = require("./authentication_middleware");

const router = express.Router();

// TODO: Finish this protected route
router.get("/questions", authenticateToken, () => {});

module.exports = router;
