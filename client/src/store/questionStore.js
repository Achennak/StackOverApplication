import create from "zustand";
// import axios from "axios";

const mockQuestions = [
  {
    id: 1,
    title: "How to center a div horizontally and vertically?",
    body: "I have a div that I want to center both horizontally and vertically within its parent container. What are some ways to achieve this using CSS?",
    tags: ["css", "layout", "centering"],
    answers: [],
  },
  {
    id: 2,
    title: "What is the difference between let and var in JavaScript?",
    body: "I see both `let` and `var` being used to declare variables in JavaScript. What are the differences between them and when should I use each one?",
    tags: ["javascript", "variables", "scope"],
    answers: [],
  },
  {
    id: 3,
    title: "How to make a PUT request with Axios in React?",
    body: "I want to send a PUT request to update some data on the server using Axios in my React application. Can someone provide an example of how to do this?",
    tags: ["react", "axios", "http", "put"],
    answers: [],
  },
];

const useQuestionStore = create((set) => ({
  questions: [],
  fetchQuestions: async () => {
    try {
      // const response = await axios.get('/api/questions')
      // set({ questions: response})
      set({ questions: mockQuestions });
    } catch (err) {
      console.log("api call error");
    }
  },
  addQuestion: () => {},
}));

export default useQuestionStore;
