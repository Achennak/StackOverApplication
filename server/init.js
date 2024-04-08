// Setup database with initial test data.
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { MONGO_URL } = require("./config");
const User = require("./models/user");

mongoose.connect(MONGO_URL);

let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// TODO: Move this function out of init.js
const createAdminUser = async () => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("1234", salt);
  const adminUser = new User({
    userName: "admin",
    email: "test@test.com",
    password: hashedPassword,
    isAdmin: true,
  });
  return adminUser.save();
};
const init = async () => {
  console.log("insert test data into the database");
  await createAdminUser();
  if (db) db.close();

  console.log("done");
};

init().catch((err) => {
  console.log("ERROR: " + err);
  if (db) db.close();
});

console.log("processing ...");
