import { create } from "zustand";
import axiosInstance from "../api/axiosInstance";

const useQuestionStore = create((set) => ({
  questions: [],
  fetchQuestions: async () => {
    try {
      const response = await axiosInstance.get("/questions/getAllQuestions");
      const questionData = response.data;
      set({ questions: questionData });
    } catch (err) {
      console.log("api call error");
    }
  },
  addQuestion: () => {},
}));

export default useQuestionStore;
