const { default: mongoose } = require("mongoose");
const User = require("../models/user");
const supertest = require("supertest");

jest.mock("../models/user");

let server;

describe.only("POST /user/signup", () => {
  beforeEach(() => {
    server = require("../server");
  });

  afterEach(async () => {
    server.close();
    await mongoose.disconnect();
  });
  it("should signup a new user", async () => {
    const userData = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    };

    const response = await supertest(server)
      .post("/user/signup")
      .send(userData)
      .expect(201);

    expect(response.body.token).toBeDefined();
  });

  it("should return 409 if user already exists", async () => {
    const existingUser = new User({
      username: "existinguser",
      email: "existing@example.com",
      password: "password123",
    });
    await existingUser.save();

    const userData = {
      username: "existinguser",
      email: "existing@example.com",
      password: "password123",
    };

    await supertest(server).post("/user/signup").send(userData).expect(409);
  });
});

describe("POST /user/login", () => {
    beforeEach( () => {
        server = require('../server');
      });
    
      afterEach(async () => {
        server.close();
        await mongoose.disconnect()
       
      });
  it("should login with valid credentials", async () => {
    const user = new User({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    });
    await user.save();

    const loginData = {
      email: "test@example.com",
      password: "password123",
    };

    const response = await supertest(server)
      .post("/user/login")
      .send(loginData)
      .expect(200);

    expect(response.body.token).toBeDefined();
  });

  it("should return 401 with invalid password", async () => {
    const user = new User({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    });
    await user.save();

    const loginData = {
      email: "test@example.com",
      password: "wrongpassword",
    };

    await supertest(server).post("/user/login").send(loginData).expect(401);
  });

  it("should return 401 with invalid email", async () => {
    const loginData = {
      email: "nonexistent@example.com",
      password: "password123",
    };

    await supertest(server).post("/user/login").send(loginData).expect(401);
  });
});
