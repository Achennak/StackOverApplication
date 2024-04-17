const { default: mongoose } = require("mongoose");
const User = require("../models/user");
const supertest = require("supertest");
const bcrypt = require("bcrypt");


jest.mock("../models/user");

let server;

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
    User.findOne.mockResolvedValueOnce([{ email: "existing@example.com" }]);

    const userData = {
      username: "existinguser",
      email: "existing@example.com",
      password: "password123",
    };

    const response = await supertest(server).post("/user/signup").send(userData);
    expect(response.status).toBe(409);
   
  });
});

describe.only("POST /user/login", () => {
    beforeEach( () => {
        server = require('../server');
      });
    
      afterEach(async () => {
        server.close();
        await mongoose.disconnect()
       
      });
      
  it("should login with valid credentials", async () => {
    const password = "password123";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = new User({
      username: "testuser",
      email: "test@example.com",
      password: hashedPassword,
    });

    User.create.mockResolvedValueOnce(user);

    //console.log('Mocked User:', User.findOne.mockResolvedValueOnce(user));


    //User.findOne.mockResolvedValueOnce([{ email: "test@example.com" }]);

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
