// Unit tests for getTagsWithQuestionNumber in controller/tags.js
const supertest = require("supertest");
const Tag = require("../models/tags");
const Question = require("../models/question");
const { default: mongoose } = require("mongoose");

// Mock data for tags
const mockTags = [
  { tagName: "tag1" },
  { tagName: "tag2" },
  // Add more mock tags if needed
];

let server;
describe("GET /getTagsWithQuestionNumber", () => {
  beforeEach(() => {
    server = require("../server");
  });
  afterEach(async () => {
    if (server) {
      await server.close();
    }

    await mongoose.disconnect();
  });

  it("should return tags with question numbers", async () => {
    // Mocking Tag.find()
    Tag.find = jest.fn().mockResolvedValueOnce(mockTags);

    const response = await supertest(server).get("/tags/getAllTags");

    expect(response.status).toBe(200);

    expect(response.body).toEqual(mockTags);
    expect(Tag.find).toHaveBeenCalled();
  });
});
