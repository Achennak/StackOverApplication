const supertest = require("supertest");
const { default: mongoose } = require("mongoose");

const Answer = require("../models/answer");
const Question = require("../models/question");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../controller/authentication_middleware");

// Mock the Answer model
jest.mock("../models/answer");

let server;
describe("POST /addAnswer", () => {
  beforeEach(() => {
    server = require("../server");
  });

  afterEach(async () => {
    server.close();
    await mongoose.disconnect();
  });

  it("should add a new answer to the question", async () => {
    const authenticatedUser = { userId: "dummyUser" };
    authenticateToken.verifyToken = jest.fn((req, res, next) => {
      req.user = authenticatedUser;
      next();
    });

    const mockAnswer = {
      _id: "dummyAnswerId",
      text: "This is a test answer",
      createdBy: "dummyUser",
      likedBy: [],
    };

    // Mocking the request body
    const mockReqBody = {
      qid: "dummyQuestionId",
      ans: mockAnswer,
    };

    // Mock the create method of the Answer model
    Answer.create.mockResolvedValueOnce(mockAnswer);

    // Mocking the Question.findOneAndUpdate method
    Question.findOneAndUpdate = jest.fn().mockResolvedValueOnce({
      _id: "dummyQuestionId",
      answerIds: ["dummyAnswerId"],
    });

    const token = jwt.sign(authenticatedUser, "random_key");

    // Making the request
    const response = await supertest(server)
      .post("/answers/addAnswer")
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

  it("should return error when user is not logged in", async () => {
    // Mock request body
    const mockReqBody = {
      qid: "dummyQuestionId",
      ans: {
        text: "This is a test answer",
      },
    };

    // Making the request without setting the Authorization header
    const response = await supertest(server)
      .post("/answers/addAnswer")
      .send(mockReqBody);

    // Asserting the response
    expect(response.status).toBe(500);
    expect(response.body).toEqual({});
  });

  it("should return 403 when user provides an invalid token", async () => {
    // Mock request body
    const mockReqBody = {
      qid: "dummyQuestionId",
      ans: {
        text: "This is a test answer",
      },
    };

    const invalidToken = "invalid_token";

    // Making the request with the invalid token in the Authorization header
    const response = await supertest(server)
      .post("/answers/addAnswer")
      .set("Authorization", invalidToken)
      .send(mockReqBody);

    // Asserting the response
    expect(response.status).toBe(403);
    expect(response.body).toEqual({ message: "Invalid token" });
  });
});

describe("PUT /answers/:answerId/like", () => {
  beforeEach(() => {
    server = require("../server");
  });

  afterEach(async () => {
    server.close();
    await mongoose.disconnect();
  });
  const authenticatedUser = { userId: "dummyUser" };
  authenticateToken.verifyToken = jest.fn((req, res, next) => {
    req.user = authenticatedUser;
    next();
  });
  const token = jwt.sign(authenticatedUser, "random_key");

  const mockAnswer = {
    _id: "609b057ab12a0212040d18d2",
    text: "This is a test answer",
    createdBy: "609b057ab12a0212040d18d1",
    likedBy: [],
    save: jest.fn(),
  };

  it("should like an answer", async () => {
    Answer.findById.mockResolvedValueOnce(mockAnswer);

    const res = await supertest(server)
      .put("/answers/609b057ab12a0212040d18d2/like")
      .set("Authorization", token)
      .send();

    expect(res.status).toBe(200);
    expect(mockAnswer.save).toHaveBeenCalled();
    expect(mockAnswer.likedBy).toContain("dummyUser");
  });

  it("should handle errors when liking an answer", async () => {
    Answer.findById.mockRejectedValueOnce("Mock error");

    const res = await supertest(server)
      .put("/answers/609b057ab12a0212040d18d2/like")
      .set("Authorization", token)
      .send();

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Failed to like answer" });
  });

  it("should return 404 when answer is not found", async () => {
    Answer.findById.mockResolvedValueOnce(null);

    const res = await supertest(server)
      .put("/answers/609b057ab12a0212040d18d2/like")
      .set("Authorization", token)
      .send();

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Answer not found" });
  });
});

describe("PUT /answers/:answerId/dislike", () => {
  beforeEach(() => {
    server = require("../server");
  });

  afterEach(async () => {
    server.close();
    await mongoose.disconnect();
  });

  const authenticatedUser = { userId: "dummyUser" };
  authenticateToken.verifyToken = jest.fn((req, res, next) => {
    req.user = authenticatedUser;
    next();
  });
  const token = jwt.sign(authenticatedUser, "random_key");

  const mockAnswer = {
    _id: "609b057ab12a0212040d18d2",
    text: "This is a test answer",
    createdBy: "dummyUser",
    likedBy: ["dummyUser"],
    save: jest.fn(),
  };

  it("should dislike an answer", async () => {
    Answer.findById.mockResolvedValueOnce(mockAnswer);

    const res = await supertest(server)
      .put("/answers/609b057ab12a0212040d18d2/dislike")
      .set("Authorization", token)
      .send();

    expect(res.status).toBe(200);
    expect(mockAnswer.save).toHaveBeenCalled();
    expect(mockAnswer.likedBy).not.toContain("dummyUser");
  });

  it("should handle errors when disliking an answer", async () => {
    Answer.findById.mockRejectedValueOnce("Mock error");

    const res = await supertest(server)
      .put("/answers/609b057ab12a0212040d18d2/dislike")
      .set("Authorization", token)
      .send();

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Failed to dislike answer" });
  });

  it("should return 404 when answer is not found", async () => {
    Answer.findById.mockResolvedValueOnce(null);

    const res = await supertest(server)
      .put("/answers/609b057ab12a0212040d18d2/dislike")
      .set("Authorization", token)
      .send();

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Answer not found" });
  });
});

describe("DELETE /answers/:answerId", () => {
  beforeEach(() => {
    server = require("../server");
  });

  afterEach(async () => {
    server.close();
    await mongoose.disconnect();
  });

  // Mocking the authentication token
  const authenticatedUser = { userId: "dummyUser" };
  authenticateToken.verifyToken = jest.fn((req, res, next) => {
    req.user = authenticatedUser;
    next();
  });

  const mockAnswer = {
    _id: "609b057ab12a0212040d18d2",
    text: "This is a test answer",
    createdBy: "609b057ab12a0212040d18d1",
    questionId: "609b057ab12a0212040d18d3",
  };
  const token = jwt.sign(authenticatedUser, "random_key");

  it("should delete an answer", async () => {
    Answer.findOneAndDelete.mockResolvedValueOnce(mockAnswer);
    Question.updateOne = jest.fn().mockResolvedValueOnce(null);
    const res = await supertest(server)
      .delete("/answers/609b057ab12a0212040d18d2")
      .set("Authorization", token)
      .send();

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Answer deleted successfully" });
  });

  it("should handle errors when deleting an answer", async () => {
    Answer.findOneAndDelete.mockRejectedValueOnce("Mock error");

    const res = await supertest(server)
      .delete("/answers/609b057ab12a0212040d18d2")
      .set("Authorization", token)
      .send();

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Failed to delete answer" });
  });

  it("should return 404 when answer is not found or user is not authorized", async () => {
    Answer.findOneAndDelete.mockResolvedValueOnce(null);

    const res = await supertest(server)
      .delete("/answers/609b057ab12a0212040d18d2")
      .set("Authorization", token)
      .send();

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      error: "Answer not found or you are not authorized to delete this answer",
    });
  });
});

describe.skip("GET /answers/getAnswersByUserId/:userId", () => {
  beforeEach(() => {
    server = require("../server");
  });

  afterEach(async () => {
    server.close();
    await mongoose.disconnect();
  });

  // Mocking the authentication token
  const authenticatedUser = { _id: "dummyUserId" };
  authenticateToken.verifyToken = jest.fn((req, res, next) => {
    req.user = authenticatedUser;
    next();
  });

  const token = jwt.sign(authenticatedUser, "random_key");

  it("should return answers for a specific user", async () => {
    const userId = "dummyUserId";
    const mockAnswers = [
      { _id: "answer1", text: "Answer 1", createdBy: userId },
      { _id: "answer2", text: "Answer 2", createdBy: userId },
    ];

    // Answer.find.mockResolvedValueOnce(mockAnswers);
    Answer.find = jest.fn().mockResolvedValueOnce(mockAnswers);
    /*Answer.find = jest.fn().mockImplementation(() => ({
      populate: jest.fn().mockResolvedValueOnce(mockAnswers),
    }));*/

    const response = await supertest(server)
      .get(`/answers/getAnswersByUserId/${userId}`)
      .set("Authorization", token)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockAnswers);
  });

  it("should return 500 when there is an error fetching answers", async () => {
    const userId = "dummyUserId";

    Answer.find.mockRejectedValueOnce("Mock error");

    const response = await supertest(server)
      .get(`/answers/getAnswersByUserId/${userId}`)
      .set("Authorization", token)
      .send();

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal server error" });
  });

  it("should return 403 when user is not authorized", async () => {
    const userId = "dummyUserId";
    const unauthorizedUserId = "unauthorizedUserId";

    const mockAnswers = [
      { _id: "answer1", text: "Answer 1", createdBy: "dummyUserId" },
      { _id: "answer2", text: "Answer 2", createdBy: "dummyUserId" },
    ];

    Answer.find.mockResolvedValueOnce(mockAnswers);

    const token = jwt.sign({ _id: unauthorizedUserId }, "random_key");

    const response = await supertest(server)
      .get(`/answers/getAnswersByUserId/${userId}`)
      .set("Authorization", token)
      .send();

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ message: "Unauthorized" });
  });
});

describe("GET /answers/getAnswersForQuestion/:questionId", () => {
  beforeEach(() => {
    server = require("../server");
  });

  afterEach(async () => {
    server.close();
    await mongoose.disconnect();
  });

  const authenticatedUser = { _id: "dummyUser" };

  authenticateToken.verifyToken = jest.fn((req, res, next) => {
    req.user = authenticatedUser;
    next();
  });
  const token = jwt.sign(authenticatedUser, "random_key");

  it("should return answers for a specific question", async () => {
    const questionId = "dummyQuestionId";
    const mockAnswers = [
      { _id: "answer1", text: "Answer 1", createdBy: "dummyUser" },
      { _id: "answer2", text: "Answer 2", createdBy: "dummyUser" },
    ];

    const mockQuestion = {
      _id: "dummyQuestionId",
      title: "Dummy Question",
      text: "This is a dummy question",
      createdBy: "dummyUser",
      answerIds: mockAnswers,
    };

    Question.findById = jest.fn().mockImplementation(() => ({
      populate: jest.fn().mockResolvedValueOnce(mockQuestion),
    }));

    const response = await supertest(server)
      .get(`/answers/getAnswersForQuestion/${questionId}`)
      .set("Authorization", token)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockAnswers);
  });

  it("should return error when question is not found", async () => {
    const nonExistingQuestionId = "nonExistingQuestionId";

    Question.findById = jest.fn().mockImplementation(() => ({
      populate: jest.fn().mockRejectedValue(new Error("Question not found")),
    }));

    const response = await supertest(server)
      .get(`/answers/getAnswersForQuestion/${nonExistingQuestionId}`)
      .set("Authorization", token)
      .send();

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Question not found" });
  });
});
