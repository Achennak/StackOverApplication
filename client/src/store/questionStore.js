import { create } from "zustand";
import axiosInstance from "../api/axiosInstance";

// [
//   {
//       "_id": "661e96405b22f6ccab8bb662",
//       "title": "Programmatically navigate using React router",
//       "text": "the alert shows the proper index for the li clicked, and when I alert the variable within the last function Im calling, moveToNextImage(stepClicked), the same value shows but the animation isnt happening. This works many other ways, but Im trying to pass the index value of the list item clicked to use for the math to calculate.",
//       "answerIds": [
//           "661e96405b22f6ccab8bb652",
//           "661e96405b22f6ccab8bb654"
//       ],
//       "createdBy": {
//           "_id": "661e963f5b22f6ccab8bb64a"
//       },
//       "creationDate": "2022-01-20T08:00:00.000Z",
//       "likedBy": [],
//       "views": 10,
//       "__v": 0,
//       "tags": [
//           "react",
//           "javascript"
//       ]
//   },
//   {
//       "_id": "661e96405b22f6ccab8bb664",
//       "title": "android studio save string shared preference, start activity and load the saved string",
//       "text": "I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.",
//       "answerIds": [
//           "661e96405b22f6ccab8bb656",
//           "661e96405b22f6ccab8bb658",
//           "661e96405b22f6ccab8bb65a"
//       ],
//       "createdBy": {
//           "_id": "661e963f5b22f6ccab8bb64c"
//       },
//       "creationDate": "2023-01-10T16:24:30.000Z",
//       "likedBy": [],
//       "views": 121,
//       "__v": 0,
//       "tags": [
//           "android-studio",
//           "shared-preferences",
//           "javascript"
//       ]
//   },
//   {
//       "_id": "661e96405b22f6ccab8bb666",
//       "title": "Object storage for a web application",
//       "text": "I am currently working on a website where, roughly 40 million documents and images should be served to its users. I need suggestions on which method is the most suitable for storing content with subject to these requirements.",
//       "answerIds": [
//           "661e96405b22f6ccab8bb65c",
//           "661e96405b22f6ccab8bb65e"
//       ],
//       "createdBy": {
//           "_id": "661e963f5b22f6ccab8bb64e"
//       },
//       "creationDate": "2023-02-18T06:02:15.000Z",
//       "likedBy": [],
//       "views": 200,
//       "__v": 0,
//       "tags": [
//           "storage",
//           "website"
//       ]
//   },
//   {
//       "_id": "661e96405b22f6ccab8bb668",
//       "title": "Quick question about storage on android",
//       "text": "I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains",
//       "answerIds": [
//           "661e96405b22f6ccab8bb660"
//       ],
//       "createdBy": {
//           "_id": "661e96405b22f6ccab8bb650"
//       },
//       "creationDate": "2023-03-10T19:28:01.000Z",
//       "likedBy": [],
//       "views": 103,
//       "__v": 0,
//       "tags": [
//           "android-studio",
//           "shared-preferences",
//           "storage"
//       ]
//   }
// ]

const useQuestionStore = create((set) => ({
  questions: [],
  fetchQuestions: async () => {
    try {
      const response = await axiosInstance.get("/questions/getQuestion");
      const questionData = response.data;
      set({ questions: questionData });
    } catch (err) {
      console.log("api call error");
    }
  },
  addQuestion: () => {},
}));

export default useQuestionStore;
