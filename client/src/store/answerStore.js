import { create } from "zustand";
import axiosInstance from "../api/axiosInstance";

// const dummyAnswers = [
//   {
//     _id: "661e96405b22f6ccab8bb65c",
//     text: "Storing content as BLOBs in databases.",
//     createdBy: "661e963f5b22f6ccab8bb64c",
//     likedBy: [],
//     creationDate: "2023-02-19T23:20:59.000Z",
//     __v: 0,
//   },
//   {
//     _id: "661e96405b22f6ccab8bb65e",
//     text: "Using GridFS to chunk and store content.",
//     createdBy: "661e963f5b22f6ccab8bb64e",
//     likedBy: [],
//     creationDate: "2023-02-22T22:19:00.000Z",
//     __v: 0,
//   },
// ];

const useAnswerStore = create((set, get) => ({
  answers: [],
  fetchAnswers: async (qid) => {
    try {
      const response = await axiosInstance.get(
        `/answers/getAnswersForQuestion/${qid}`
      );
      set({ answers: response.data });
    } catch (error) {
      console.error("Error fetching answers:", error);
    }
  },
  postAnswer: async (answer) => {
    try {
      const response = await axiosInstance.post("/answers/addAnswer", answer);
      set((state) => ({
        answers: [...state.answers, response.data],
      }));
    } catch (error) {
      console.error("Error posting answer:", error);
    }
  },
  likeAnswer: async (answerId, userId) => {
    try {
      const answer = get().answers.find((answer) => answer._id === answerId);
      if (!answer.likedBy.includes(userId)) {
        await axiosInstance.put(`/answers/${answerId}/like`);
        set((state) => ({
          answers: state.answers.map((answer) =>
            answer._id === answerId
              ? { ...answer, likedBy: [...answer.likedBy, userId] }
              : answer
          ),
        }));
      }
    } catch (error) {
      console.error("Error liking answer:", error);
    }
  },
  dislikeAnswer: async (answerId, userId) => {
    try {
      const answer = get().answers.find((answer) => answer._id === answerId);
      if (answer.likedBy.includes(userId)) {
        await axiosInstance.put(`/answers/${answerId}/dislike`);
        set((state) => ({
          answers: state.answers.map((answer) =>
            answer._id === answerId
              ? {
                  ...answer,
                  likedBy: answer.likedBy.filter((id) => id !== userId),
                }
              : answer
          ),
        }));
      }
    } catch (error) {
      console.error("Error disliking answer:", error);
    }
  },
  deleteAnswer: async (answerId) => {
    try {
      await axiosInstance.delete(`/answers/${answerId}`);
      set((state) => ({
        answers: state.answers.filter((answer) => answer._id !== answerId),
      }));
    } catch (error) {
      console.error("Error deleting answer:", error);
    }
  },
}));

export default useAnswerStore;
