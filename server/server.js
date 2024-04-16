const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const {MONGO_URL, CLIENT_URL,port } = require("./config");

mongoose.connect(MONGO_URL);

const app = express();

app.use(cors({credentials: true,
  origin: [CLIENT_URL],}));
app.use(express.json());

app.get("/", (_, res) => {
  res.send("Fake SO Server Dummy Endpoint");
  res.end();
});

const userController = require("./controller/userController");
const questionController = require("./controller/questionController");
const authenticateToken = require("./controller/authentication_middleware");
const answerController = require("./controller/answerController");
const tagsController = require("./controller/tagsController");

app.use("/user", userController);
app.use("/questions",authenticateToken,questionController);
app.use("/answers",authenticateToken,answerController);
app.use("/tags",tagsController);


let server = app.listen(port, () => {
  console.log(`Server starts at http://localhost:${port}`);
});

process.on("SIGINT", () => {
  server.close();
  mongoose.disconnect();
  console.log("Server closed. Database instance disconnected");
  process.exit(0);
});

module.exports = server

