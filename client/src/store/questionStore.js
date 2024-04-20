import { create } from "zustand";
import axiosInstance from "../api/axiosInstance";

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
  addQuestion: async (questionData) => {
    try {
      const response = await axiosInstance.post(
        "/questions/addQuestion",
        questionData
      );
      return response.data;
    } catch (error) {
      console.error("Error adding question:", error);
      throw error;
    }
  },
}));

export default useQuestionStore;
