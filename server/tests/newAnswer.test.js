const supertest = require("supertest")
const { default: mongoose } = require("mongoose");

const Answer = require("../models/answer");
const Question = require("../models/question");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../controller/authentication_middleware");


// Mock the Answer model
jest.mock("../models/answer");
;
let server;
describe("POST /addAnswer", () => {
 
beforeEach(() => {
    server = require("../server");
  })

  afterEach(async() => {
    server.close();
    await mongoose.disconnect()
  });

  it("should add a new answer to the question", async () => {
    
 // Mocking the authentication token
 const authenticatedUser = { _id: 'dummyUser' };
 authenticateToken.verifyToken = jest.fn((req, res, next) => {
  req.user = authenticatedUser;
  next();
});

const mockAnswer = {
  _id: "dummyAnswerId",
  text: "This is a test answer",
  createdBy: "dummyUser", 
  likedBy: []
};

// Mocking the request body
const mockReqBody = {
  qid: "dummyQuestionId",
  ans: mockAnswer
  
};
  
    // Mock the create method of the Answer model
    Answer.create.mockResolvedValueOnce(mockAnswer);

    // Mocking the Question.findOneAndUpdate method
    Question.findOneAndUpdate = jest.fn().mockResolvedValueOnce({
      _id: "dummyQuestionId",
      answerIds: ["dummyAnswerId"]
    });

   
    const token = jwt.sign(authenticatedUser, "random_key");

    // Making the request
    const response = await supertest(server)
      .post("/answer/addAnswer")
      .set("Authorization", token) 
      .send(mockReqBody);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockAnswer);

    // Verifying that Question.findOneAndUpdate method was called with the correct arguments
    expect(Question.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: "dummyQuestionId" },
      { $push: { answerIds: { $each: ["dummyAnswerId"], $position: 0 } } },
      { new: true }
    );
  });

  it("should return 401 when user is not logged in", async () => {
    // Mock request body
    const mockReqBody = {
      qid: "dummyQuestionId",
      ans: {
        text: "This is a test answer"
      }
    };
  
    // Making the request without setting the Authorization header
    const response = await supertest(server)
      .post("/answer/addAnswer")
      .send(mockReqBody);
  
    // Asserting the response
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "No token provided" });
  });
  
  it("should return 403 when user provides an invalid token", async () => {
    // Mock request body
    const mockReqBody = {
      qid: "dummyQuestionId",
      ans: {
        text: "This is a test answer"
      }
    };
  
    const invalidToken = "invalid_token";
  
    // Making the request with the invalid token in the Authorization header
    const response = await supertest(server)
      .post("/answer/addAnswer")
      .set("Authorization", invalidToken)
      .send(mockReqBody);
  
    // Asserting the response
    expect(response.status).toBe(403);
    expect(response.body).toEqual({ message: "Invalid token" });
  });
  
});
