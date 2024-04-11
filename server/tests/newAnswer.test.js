const supertest = require("supertest")
const { default: mongoose } = require("mongoose");

const Answer = require("../models/answer");
const Question = require("../models/question");
const jwt = require("jsonwebtoken");


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
    // Mocking the request body
    const mockReqBody = {
      qid: "dummyQuestionId",
      ans: {
        text: "This is a test answer"
      }
    };
 // Mocking the authentication token
 const mockUser = {
  _id: "dummyUserId"
};

const mockAnswer = {
  _id: "dummyAnswerId",
  text: "This is a test answer",
  userId: "dummyUserId", 
  likes: 0,
  creationDate: expect.any(Date),
};
  
    // Mock the create method of the Answer model
    Answer.create.mockResolvedValueOnce(mockAnswer);

    // Mocking the Question.findOneAndUpdate method
    Question.findOneAndUpdate = jest.fn().mockResolvedValueOnce({
      _id: "dummyQuestionId",
      answerIds: ["dummyAnswerId"]
    });

   
    const token = jwt.sign(mockUser, "random_key");
    const authorizationHeader = `Bearer ${token}`;

    // Making the request
    const response = await supertest(server)
      .post("/answer/addAnswer")
      .set("Authorization", authorizationHeader) 
      .send(mockReqBody);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockAnswer);

    // Verifying that Answer.create method was called with the correct arguments
  
  });
});
