// Application server

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { MONGO_URL, port } = require("./config");

mongoose.connect(MONGO_URL);

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.send("Fake SO Server Dummy Endpoint");
  res.end();
});
const userController = require("./controller/userController");

app.use("/user", userController);

let server = app.listen(port, () => {
  console.log(`Server starts at http://localhost:${port}`);
});

process.on("SIGINT", () => {
  server.close();
  mongoose.disconnect();
  console.log("Server closed. Database instance disconnected");
  process.exit(0);
});
