const Tag = require("../models/tags");
const Question = require("../models/question");

const addTag = async (tname) => {
    console.log(tname);
    try {
        let tag = await Tag.findOne({ tagName: tname });
        console.log(tag);
        if (tag === null) {
            const newTag = new Tag({
                tagName: tname
            });
            const res =await newTag.save();
            console.log(res);
            return res._id;
        } else {
            return tag._id;
        }
    } catch (error) {
        console.error("Error adding tag:", error);
        return null;
    }
};

const getUnansweredQuestion = async () => {
    console.log("unanswered questions");
    try {
        const newestQuestions = await getNewestQuestion();
        // Filter questions with no answers
        const unansweredQuestions = newestQuestions.filter((question) => question.answerIds.length === 0);

        return unansweredQuestions;
    } catch (error) {
        console.error("Error getting unanswered questions:", error);
        return [];
    }
};

const getNewestQuestion = async () => {
    const questions = await Question.find().populate('tagIds');
   
    return questions.sort((a, b) => b.creationDate - a.creationDate);
  };

const getActiveQuestion = async () => {
    try {
        // Find all questions with their associated answers
        const questions = await Question.find().populate('answerIds');
        // Create a mapping of question IDs to their newest answer date
        console.log(questions);
        const newestAnswerDates = {};
        questions.forEach(question => {
            question.answerIds.forEach(answer => {
                if (!newestAnswerDates[question._id] || newestAnswerDates[question._id] < answer.creationDate) {
                    newestAnswerDates[question._id] = answer.creationDate;
                }
            });
        });

        console.log(newestAnswerDates);
        const newestQuestions = await getNewestQuestion(); // Await the result of getNewestQuestion()


        // Sort the questions based on newest answer date
        const sortedQuestions = newestQuestions.sort((a, b) => {
            const aNewestDate = newestAnswerDates[a._id];
            const bNewestDate = newestAnswerDates[b._id];

            if (!aNewestDate) {
                return 1;
            } else if (!bNewestDate) {
                return -1;
            } else if (aNewestDate > bNewestDate) {
                return -1;
            } else if (aNewestDate < bNewestDate) {
                return 1;
            } else {
                return 0;
            }
        });

        return sortedQuestions;
    } catch (error) {
        console.error("Error getting active questions:", error);
        return [];
    }
};


const getQuestionsByOrder = async (order) => {
    // complete the function 
    let qlist =[]; 
    if (order === "active") {
        qlist = await getActiveQuestion();
    } else if (order === "unanswered") {
        qlist = await getUnansweredQuestion();
    } else {
        qlist = await getNewestQuestion();
    }
    console.log(qlist);
    
   
    return qlist;
}

const filterQuestionsBySearch = (qlist, search) => {
    console.log(qlist);
    let searchTags = parseTags(search);
    console.log("Search tags :", searchTags.length);
    let searchKeyword = parseKeyword(search);
    console.log("Search keywords :", searchKeyword.length);

    const res = qlist.filter((q) => {
        if (searchKeyword.length === 0 && searchTags.length === 0) {
            return true;
        } else if (searchKeyword.length === 0) {
            console.log("searching tags");
            return checkTagInQuestion(q, searchTags);
        } else if (searchTags.length === 0) {
            return checkKeywordInQuestion(q, searchKeyword);
        } else {
            return (
                checkKeywordInQuestion(q, searchKeyword) ||
                checkTagInQuestion(q, searchTags)
            );
        }
    });
    console.log(res);
    return res;
};


const checkKeywordInQuestion = (q, keywordlist) => {
    const lowerCaseTitle = q.title.toLowerCase();
    const lowerCaseText = q.text.toLowerCase();
    for (let w of keywordlist) {
        const lowerCaseKeyword = w.toLowerCase();
        if (lowerCaseTitle.includes(lowerCaseKeyword) || lowerCaseText.includes(lowerCaseKeyword)) {
            return true;
        }
    }

    return false;
};

const checkTagInQuestion = (question, taglist) => {
    const trimmedTags = taglist.map((tag) => tag.trim());

    for (const tag of trimmedTags) {
        for (const qtag of question.tagIds) {
            if (qtag.tagName === tag) {
                return true;
            }
        }
    }

    return false;
};



const parseTags = (search) => {
    if (!search) {
        return [];
    }
    return (search.match(/\[([^\]]+)\]/g) || []).map((word) =>
        word.slice(1, -1)
    );
};

const parseKeyword = (search) => {
    if (!search) {
        return [];
    }
    return search.replace(/\[([^\]]+)\]/g, " ").match(/\b\w+\b/g) || [];
};


module.exports = { addTag, getQuestionsByOrder, filterQuestionsBySearch };