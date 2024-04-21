const { default: mongoose } = require("mongoose");
const User = require("../models/user");
const supertest = require("supertest");
const bcrypt = require("bcrypt");

jest.mock("../models/user");

let server;

describe("GET /user/details/:userId", () => {
  beforeEach(() => {
    server = require("../server");
  });

  afterEach(async () => {
    server.close();
    await mongoose.disconnect();
  });

  it("should return user details for a valid user ID", async () => {
    // Mock user data
    const mockUser = {
      _id: "validUserId",
      userName: "testuser",
      email: "test@example.com",
      password: "hashedPassword",
    };

    User.findById.mockResolvedValueOnce(mockUser);

    const response = await supertest(server)
      .get("/user/details/validUserId")
      .expect(200);

    // Validate response body
    expect(response.body).toEqual(mockUser);
  });

  it("should return 404 for an invalid user ID", async () => {
    User.findById.mockResolvedValueOnce(null);

    const response = await supertest(server)
      .get("/user/details/invalidUserId")
      .expect(404);

    // Validate response body
    expect(response.body.message).toBe("User not found");
  });
});

describe("POST /user/signup", () => {
  beforeEach(() => {
    server = require("../server");
  });

  afterEach(async () => {
    server.close();
    await mongoose.disconnect();
  });

  it("should signup a new user", async () => {
    const userData = {
      userName: "testuser",
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
    User.findOne.mockResolvedValueOnce([{ email: "existing@example.com" }]);

    const userData = {
      userName: "existinguser",
      email: "existing@example.com",
      password: "password123",
    };

    const response = await supertest(server)
      .post("/user/signup")
      .send(userData);
    expect(response.status).toBe(409);
  });
});

describe("POST /user/login", () => {
  beforeEach(() => {
    server = require("../server");
  });

  afterEach(async () => {
    server.close();
    await mongoose.disconnect();
  });

  it("should login with valid credentials", async () => {
    const password = "password123";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const mockUser = {
      userName: "testuser",
      email: "test@example.com",
      password: hashedPassword,
      isAdmin: false,
    };

    User.findOne.mockResolvedValueOnce(mockUser);

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
      userName: "testuser",
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
