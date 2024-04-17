// Unit tests for getTagsWithQuestionNumber in controller/tags.js
const supertest = require("supertest")
const Tag = require('../models/tags');
const Question = require('../models/question');
const { default: mongoose } = require("mongoose");

// Mock data for tags
const mockTags = [
  { tagName: 'tag1' },
  { tagName: 'tag2' },
  // Add more mock tags if needed
];
 
const mockQuestions = [
    { tagIds: [mockTags[0], mockTags[1]] },
    { tagIds: [mockTags[0]] },
]

let server;
describe('GET /getTagsWithQuestionNumber', () => {

    beforeEach(() => {
        server = require("../server");
    })
    afterEach(async() => {
        console.log('Closing server...');
        if (server) {
          await server.close();
          console.log('Server closed');
        } else {
          console.log('No server to close');
        }
        console.log('Current MongoDB connections:', mongoose.connection.readyState);
    
        console.log('Disconnecting from MongoDB...');
        try {
          await mongoose.disconnect();
          console.log('Disconnected from MongoDB');
        } catch (error) {
          console.error('Error disconnecting from MongoDB:', error);
        }
    });

    it('should return tags with question numbers', async () => {
        // Mocking Tag.find() and Question.find()
        Tag.find = jest.fn().mockResolvedValueOnce(mockTags);
    
        Question.find = jest.fn().mockImplementation(() => ({ populate: jest.fn().mockResolvedValueOnce(mockQuestions)}));

        // Making the request
        const response = await supertest(server).get('/tag/getTagsWithQuestionNumber');

        // Asserting the response
        expect(response.status).toBe(200);

        // Asserting the response body
        expect(response.body).toEqual([
            { tagName: 'tag1', qcnt: 2 },
            { tagName: 'tag2', qcnt: 1 },
      
        ]);
        expect(Tag.find).toHaveBeenCalled();
        expect(Question.find).toHaveBeenCalled();
  });
});
