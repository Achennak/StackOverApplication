import { create } from "zustand";
import axiosInstance from "../api/axiosInstance";

const useQuestionStore = create((set, get) => ({
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
  likeQuestion: async (questionId, userId) => {
    try {
      const questions = get().questions;
      const questionIndex = questions.findIndex((q) => q._id === questionId);
      if (
        questionIndex !== -1 &&
        !questions[questionIndex].likedBy.includes(userId)
      ) {
        const response = await axiosInstance.post(
          `/questions/like/${questionId}`,
          { userId }
        );
        if (response.status === 200) {
          const updatedQuestions = [...questions];
          updatedQuestions[questionIndex].likedBy.push(userId);
          set({ questions: updatedQuestions });
        }
      }
    } catch (error) {
      console.error(error);
    }
  },
  dislikeQuestion: async (questionId, userId) => {
    try {
      const questions = get().questions;
      const questionIndex = questions.findIndex((q) => q._id === questionId);
      if (
        questionIndex !== -1 &&
        questions[questionIndex].likedBy.includes(userId)
      ) {
        const response = await axiosInstance.post(
          `/questions/dislike/${questionId}`,
          { userId }
        );
        if (response.status === 200) {
          const updatedQuestions = [...questions];
          const userIndex =
            updatedQuestions[questionIndex].likedBy.indexOf(userId);
          if (userIndex !== -1) {
            updatedQuestions[questionIndex].likedBy.splice(userIndex, 1);
            set({ questions: updatedQuestions });
          }
        }
      }
    } catch (error) {
      console.error("dislikeQuestion error:", error);
    }
  },
}));

export default useQuestionStore;
