const supertest = require("supertest");
const { default: mongoose } = require("mongoose");
const jwt = require("jsonwebtoken");
const Question = require("../models/question");
const User = require("../models/User");

const authenticateToken = require("../controller/authentication_middleware");
const {
  addTag,
  getQuestionsByOrder,
  filterQuestionsBySearch,
} = require("../utils/question");

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
    if (server) {
      await server.close();
    }
    await mongoose.disconnect();
  });

  const authenticatedUser = { _id: "dummyUser" };
  authenticateToken.verifyToken = jest.fn((req, res, next) => {
    req.user = authenticatedUser;
    next();
  });

  const token = jwt.sign(authenticatedUser, "random_key");

  it("should return questions by filter", async () => {
    const mockReqQuery = {
      order: "someOrder",
      search: "someSearch",
    };

    getQuestionsByOrder.mockResolvedValueOnce(mockQuestions);
    filterQuestionsBySearch.mockReturnValueOnce(mockQuestions);

    const response = await supertest(server)
      .get("/questions/getQuestion")
      .set("authorization", token)
      .query(mockReqQuery);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockQuestions);
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
    const mockTags = [tag1, tag2];

    const mockQuestion = {
      _id: "65e9b58910afe6e94fc6e6fe",
      title: "Question 3 Title",
      text: "Question 3 Text",
      tagIds: [tag1, tag2],
      answerIds: [ans1],
    };

    const authenticatedUser = { _id: "dummyUser" };
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
    expect(response.status).toBe(500);
    expect(response.body).toEqual({});
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
  describe("POST /addQuestion with invalid token", () => {
    beforeEach(() => {
      server = require("../server");
    });

    afterEach(async () => {
      server.close();
      await mongoose.disconnect();
    });

    it("should handle error when adding a new question", async () => {
      const userId = "userId123";
      const mockQuestion = {
        title: "New Question",
        text: "Question text",
        tagIds: ["tag1", "tag2"],
        answerIds: [],
      };
      const authenticatedUser = { _id: userId };
      authenticateToken.verifyToken = jest.fn((req, res, next) => {
        req.user = authenticatedUser;
        next();
      });
      Question.create.mockRejectedValueOnce(new Error("Database error"));

      const token = jwt.sign(authenticatedUser, "random_key");

      const response = await supertest(server)
        .post("/questions/addQuestion")
        .set("authorization", token)
        .send(mockQuestion)
        .expect(500);

      expect(response.body).toEqual({ error: "Internal server error" });
    });

    it("should return 500 when user is not authenticated", async () => {
      const mockQuestion = {
        title: "New Question",
        text: "Question text",
        tagIds: ["tag1", "tag2"],
        answerIds: [],
      };

      const response = await supertest(server)
        .post("/questions/addQuestion")
        .send(mockQuestion)
        .expect(500);

      expect(response.body).toEqual({});
    });
  });
});

describe("POST /questions/like/:questionId", () => {
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

  it("should like a question", async () => {
    const mockQuestionId = "65e9b58910afe6e94fc6e6dc";

    const mockQuestion = {
      _id: mockQuestionId,
      title: "Title",
      text: "Text",
      createdBy: "dummyUser",
      likedBy: [],
      save: jest.fn(),
    };

    Question.findById.mockResolvedValueOnce(mockQuestion);

    // Making the request
    const response = await supertest(server)
      .post(`/questions/like/${mockQuestionId}`)
      .set("authorization", token)
      .send();

    expect(response.status).toBe(200);
    expect(mockQuestion.save).toHaveBeenCalled();
    expect(mockQuestion.likedBy).toContain("dummyUser");
  });

  it("should return 404 if question is not found", async () => {
    const mockQuestionId = "nonExistentQuestionId";
    Question.findById.mockResolvedValueOnce(null); // Simulating no question found

    // Making the request
    const response = await supertest(server)
      .post(`/questions/like/${mockQuestionId}`)
      .set("authorization", token)
      .send();

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Question not found" });
  });

  it("should return 400 if user has already liked the question", async () => {
    const mockQuestionId = "65e9b58910afe6e94fc6e6dc";
    const mockQuestion = {
      _id: mockQuestionId,
      title: "Title",
      text: "Text",
      createdBy: "dummyUser",
      likedBy: ["dummyUser"], // Simulating user already liked the question
      save: jest.fn(),
    };
    Question.findById.mockResolvedValueOnce(mockQuestion);

    // Making the request
    const response = await supertest(server)
      .post(`/questions/like/${mockQuestionId}`)
      .set("authorization", token)
      .send();

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "Question already liked by this user",
    });
  });

  it("should return 500 if there is an internal server error", async () => {
    const mockQuestionId = "65e9b58910afe6e94fc6e6dc";
    Question.findById.mockRejectedValueOnce(new Error("Internal server error"));

    // Making the request
    const response = await supertest(server)
      .post(`/questions/like/${mockQuestionId}`)
      .set("authorization", token)
      .send();

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Internal server error" });
  });
});

describe("POST /questions/dislike/:questionId", () => {
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

  it("should dislike a question", async () => {
    // Mock data
    const mockQuestionId = "65e9b58910afe6e94fc6e6dc";
    const mockQuestion = {
      _id: mockQuestionId,
      title: "Title",
      text: "Text",
      createdBy: "dummyUser",
      likedBy: ["dummyUser"],
      save: jest.fn(),
    };

    Question.findById.mockResolvedValueOnce(mockQuestion);
    // Making the request
    const response = await supertest(server)
      .post(`/questions/dislike/${mockQuestionId}`)
      .set("authorization", token)
      .send();

    // Assertions
    expect(response.status).toBe(200);
    expect(mockQuestion.save).toHaveBeenCalled();
    expect(mockQuestion.likedBy).not.toContain("dummyUser");
  });
  it("should return 404 if question is not found", async () => {
    const mockQuestionId = "nonExistentQuestionId";
    Question.findById.mockResolvedValueOnce(null); // Simulating no question found

    // Making the request
    const response = await supertest(server)
      .post(`/questions/dislike/${mockQuestionId}`)
      .set("authorization", token)
      .send();

    // Assertions
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Question not found" });
  });

  it("should return 400 if user has not liked the question", async () => {
    const mockQuestionId = "65e9b58910afe6e94fc6e6dc";
    const mockQuestion = {
      _id: mockQuestionId,
      title: "Title",
      text: "Text",
      createdBy: "dummyUser",
      likedBy: [], // Simulating user has not liked the question
      save: jest.fn(),
    };
    Question.findById.mockResolvedValueOnce(mockQuestion);

    // Making the request
    const response = await supertest(server)
      .post(`/questions/dislike/${mockQuestionId}`)
      .set("authorization", token)
      .send();

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Question not liked by this user" });
  });

  it("should return 500 if there is an internal server error", async () => {
    const mockQuestionId = "65e9b58910afe6e94fc6e6dc";
    Question.findById.mockRejectedValueOnce(new Error("Internal server error"));

    const response = await supertest(server)
      .post(`/questions/dislike/${mockQuestionId}`)
      .set("authorization", token)
      .send();

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Internal server error" });
  });
});

describe("DELETE /questions/:questionId", () => {
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
  it("should delete a question", async () => {
    const mockUser = {
      _id: "dummyUser",
      userName: "testuser",
      email: "test@example.com",
      password: "hashedPassword",
      isAdmin: false,
      save: jest.fn(),
    };

    const mockQuestionId = "65e9b58910afe6e94fc6e6dc";
    const mockQuestion = {
      _id: mockQuestionId,
      title: "Title",
      text: "Text",
      createdBy: "dummyUser",
      save: jest.fn(),
    };

    Question.findById.mockResolvedValueOnce(mockQuestion);
    User.findById = jest.fn().mockResolvedValueOnce(mockUser);

    // Making the request
    const response = await supertest(server)
      .delete(`/questions/${mockQuestionId}`)
      .set("authorization", token)
      .send();

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Question deleted successfully" });
    expect(Question.findById).toHaveBeenCalledWith(mockQuestionId);
    expect(User.findById).toHaveBeenCalledWith("dummyUser");
  });

  it("should return 403 if user is not the creator and not admin", async () => {
    const mockQuestionId = "65e9b58910afe6e94fc6e6dc";
    const mockQuestion = {
      _id: mockQuestionId,
      title: "Title",
      text: "Text",
      createdBy: "anotherUser", // Assuming another user created this question
      save: jest.fn(),
    };
    Question.findById.mockResolvedValueOnce(mockQuestion);

    const response = await supertest(server)
      .delete(`/questions/${mockQuestionId}`)
      .set("authorization", token);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: "Invalid User" });
  });
});

describe.skip("GET /questions/getQuestionsByUserId/:userId", () => {
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

  it("should return questions for the specified user", async () => {
    const mockUserId = "dummyUser";
    const mockQuestions = [
      { _id: "question1", title: "Title 1", createdBy: mockUserId },
      { _id: "question2", title: "Title 2", createdBy: mockUserId },
    ];

    Question.find.mockResolvedValueOnce(mockQuestions);

    const res = await supertest(server)
      .delete(`/questions/$getQuestionsByUserId/${userId}`)
      .set("authorization", token)
      .send();

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(mockPopulatedQuestions);
    expect(Question.find).toHaveBeenCalledWith({ createdBy: mockUserId });
    expect(Question.populate).toHaveBeenCalledWith(mockQuestions, [
      { path: "tagIds" },
      { path: "createdBy", select: "userName" },
    ]);
  });

  it("should return 500 if an error occurs", async () => {
    const mockUserId = "dummyUser";
    const req = { params: { userId: mockUserId } };
    const res = { json: jest.fn(), status: jest.fn() };

    // Mocking error
    Question.find.mockRejectedValueOnce(new Error("Database error"));

    await getQuestionsForUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });
});
