const supertest = require("supertest");
const { default: mongoose } = require("mongoose");
const jwt = require("jsonwebtoken");
const Question = require("../models/question");
const authenticateToken = require("../controller/authentication_middleware");
const {
  addTag,
  getQuestionsByOrder,
  filterQuestionsBySearch,
} = require("../utils/question");
const { MONGO_URL } = require("../config");

// Mocking the models
jest.mock("../models/question");
jest.mock("../utils/question", () => ({
  addTag: jest.fn(),
  getQuestionsByOrder: jest.fn(),
  filterQuestionsBySearch: jest.fn(),
}));

const tag1 = {
  _id: "507f191e810c19729de860ea",
  tagName: "tag1",
};
const tag2 = {
  _id: "65e9a5c2b26199dbcc3e6dc8",
  tagName: "tag2",
};

const ans1 = {
  _id: "65e9b58910afe6e94fc6e6dc",
  text: "Answer 1 Text",
  createdBy: "answer1_user",
};

const ans2 = {
  _id: "65e9b58910afe6e94fc6e6dd",
  text: "Answer 2 Text",
  createdBy: "answer2_user",
};

const mockQuestions = [
  {
    _id: "65e9b58910afe6e94fc6e6dc",
    title: "Question 1 Title",
    text: "Question 1 Text",
    tagIds: [tag1],
    answerIds: [ans1],
    views: 21,
  },
  {
    _id: "65e9b5a995b6c7045a30d823",
    title: "Question 2 Title",
    text: "Question 2 Text",
    tagIds: [tag2],
    answerIds: [ans2],
    views: 99,
  },
];

let server;

describe("GET /getQuestion", () => {
  beforeEach(async () => {
    server = require("../server");
  });

  afterEach(async () => {
    console.log("Closing server...");
    if (server) {
      await server.close();
      console.log("Server closed");
    } else {
      console.log("No server to close");
    }
    console.log("Current MongoDB connections:", mongoose.connection.readyState);

    console.log("Disconnecting from MongoDB...");
    try {
      await mongoose.disconnect();
      console.log("Disconnected from MongoDB");
    } catch (error) {
      console.error("Error disconnecting from MongoDB:", error);
    }
  });

  it("should return questions by filter", async () => {
    const mockReqQuery = {
      order: "someOrder",
      search: "someSearch",
    };

    getQuestionsByOrder.mockResolvedValueOnce(mockQuestions);
    filterQuestionsBySearch.mockReturnValueOnce(mockQuestions);

    const response = await supertest(server)
      .get("/questions/getQuestion")
      .query(mockReqQuery);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockQuestions);
  });
});

describe("GET /getQuestionById/:qid", () => {
  beforeEach(() => {
    server = require("../server");
  });

  afterEach(async () => {
    server.close();
    await mongoose.disconnect();
  });

  it("With null question id", async () => {
    // Mock request parameters
    const mockReqParams = {
      qid: null, //null or not existing in DB , when DB is down
    };
    // Making the request
    const response = await supertest(server).get(
      `/questions/getQuestionById/${mockReqParams.qid}`
    );

    // Asserting the response
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Internal server error" });
  });

  it("With invalid question id ", async () => {
    // Mock request parameters
    const mockReqParams = {
      qid: "InvalidID",
    };

    const mockPopulatedQuestion = {};

    // Provide mock question data
    Question.findOneAndUpdate = jest
      .fn()
      .mockImplementation(() => ({
        populate: jest.fn().mockRejectedValue(new Error("invalid question")),
      }));

    // Making the request
    const response = await supertest(server).get(
      `/questions/getQuestionById/${mockReqParams.qid}`
    );
    console.log("response is :", response.body);
    // Asserting the response
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Internal server error" });
  });

  it("When empty object is returned", async () => {
    // Mock request parameters
    const mockReqParams = {
      qid: "65e9b5a995b6c7045a30d823",
    };

    Question.findOneAndUpdate = jest.fn().mockImplementation(null);

    // Making the request
    const response = await supertest(server).get(
      `/questions/getQuestionById/${mockReqParams.qid}`
    );
    console.log("response is :", response.body);
    // Asserting the response
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Internal server error" });
  });

  it("should return a question by id and increment its views by 1", async () => {
    // Mock request parameters
    const mockReqParams = {
      qid: "65e9b5a995b6c7045a30d823",
    };

    const mockPopulatedQuestion = {
      answers: [
        mockQuestions.filter((q) => q._id == mockReqParams.qid)[0]["answerIds"],
      ], // Mock answers
      views: mockQuestions[1].views + 1,
    };

    // Provide mock question data
    Question.findOneAndUpdate = jest
      .fn()
      .mockImplementation(() => ({
        populate: jest.fn().mockResolvedValueOnce(mockPopulatedQuestion),
      }));

    // Making the request
    const response = await supertest(server).get(
      `/questions/getQuestionById/${mockReqParams.qid}`
    );
    console.log("response is :", response.body);
    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockPopulatedQuestion);
  });
});

describe("POST /addQuestion", () => {
  beforeEach(() => {
    server = require("../server");
  });

  afterEach(async () => {
    server.close();
    await mongoose.disconnect();
  });

  it("should add a new question", async () => {
    // Mock request body

    const mockTags = [tag1, tag2];

    const mockQuestion = {
      _id: "65e9b58910afe6e94fc6e6fe",
      title: "Question 3 Title",
      text: "Question 3 Text",
      tagIds: [tag1, tag2],
      answerIds: [ans1],
    };

    const authenticatedUser = { _id: "dummyUser" };
    // Mock verifyToken function to simulate authentication
    authenticateToken.verifyToken = jest.fn((req, res, next) => {
      req.user = authenticatedUser;
      next();
    });

    addTag.mockResolvedValueOnce(mockTags);
    Question.create.mockResolvedValueOnce(mockQuestion);

    const token = jwt.sign(authenticatedUser, "random_key");

    // Making the request
    const response = await supertest(server)
      .post("/questions/addQuestion")
      .set("authorization", token)
      .send(mockQuestion);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockQuestion);
  });

  it("should return 401 when user is not logged in", async () => {
    // Mock request body
    const mockQuestion = {
      title: "Question 3 Title",
      text: "Question 3 Text",
      tagIds: [tag1, tag2],
      answerIds: [ans1],
    };

    // Making the request without setting the Authorization header
    const response = await supertest(server)
      .post("/questions/addQuestion")
      .send(mockQuestion);

    // Asserting the response
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "No token provided" });
  });

  it("should return 403 when user provides an invalid token", async () => {
    // Mock request body
    const mockQuestion = {
      title: "Question 3 Title",
      text: "Question 3 Text",
      tagIds: [tag1, tag2],
      answerIds: [ans1],
    };

    const invalidToken = "invalid_token";

    // Making the request with the invalid token in the Authorization header
    const response = await supertest(server)
      .post("/questions/addQuestion")
      .set("authorization", invalidToken)
      .send(mockQuestion);

    // Asserting the response
    expect(response.status).toBe(403);
    expect(response.body).toEqual({ message: "Invalid token" });
  });
});
