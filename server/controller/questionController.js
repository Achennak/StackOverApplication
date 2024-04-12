const express = require("express");
const authenticateToken = require("./authentication_middleware");
const { addTag, getQuestionsByOrder, filterQuestionsBySearch } = require('../utils/question');


const router = express.Router();


// To get Questions by Filter
const getQuestionsByFilter = async (req, res) => {
    try{
    const { order, search } = req.query;
    console.log(order);
    console.log(search);

    // Fetch questions by order
    let orderedQuestions = await getQuestionsByOrder(order);
    console.log("ordered questions ", orderedQuestions);

    // Filter questions by search
    const filteredQuestions = await filterQuestionsBySearch(orderedQuestions,search);
    console.log("filtered questions ", filteredQuestions);

    res.json(filteredQuestions);
} catch (error) {
    console.error("Error getting questions by filter:", error);
    res.status(500).json({ error: "Internal server error" });
}
    
};

// To get Questions by Id
const getQuestionById = async (req, res) => {
    try {
        const { qid } = req.params;
        console.log("questionid",qid);
        const question = await Question.findOneAndUpdate(
            { _id: qid }, 
            { $inc: { views: 1 } }, 
            { new: true } 
        ).populate('answerIds');
        console.log(question);
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
        res.json(question);
    } catch (error) {
        console.error("Error getting question by ID:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// To add Question
const addQuestion = async (req,res) => {   
try{

    let { title, text, tagIds, answerIds } = req.body;

    // Set default values if parameters are undefined
    if (title === undefined) title = "Default Title";
    if (text === undefined) text = "Default Text";
    if (tagIds === undefined) tagIds = [];
    if (answerIds === undefined) answerIds = [];
    
    const userId = req.user._id;
    // Add tags
    const rtagIds = [];
        for (const tagName of tagIds) {
            const tagId = await addTag(tagName);
            rtagIds.push(tagId);
        }
    // Create new question
    const newQuestion = await Question.create({
        title,
        text,
        tagIds: rtagIds,
        answerIds: answerIds,
        createdBy:userId,
        creationDate: new Date(),
        views: 0,
    });
    console.log(newQuestion);
    res.status(200).json(newQuestion);

} catch (error) {
    console.error("Error adding question:", error);
    res.status(500).json({ error: "Internal server error" });
}
};


router.get('/getQuestion', getQuestionsByFilter); 
router.get('/getQuestionById/:qid', getQuestionById); 
router.post('/addQuestion', authenticateToken,addQuestion); 

module.exports = router;
