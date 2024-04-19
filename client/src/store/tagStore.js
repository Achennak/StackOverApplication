import { create } from "zustand";
import axiosInstance from "../api/axiosInstance";

const useTagStore = create((set) => ({
  tags: [],
  fetchTags: async () => {
    try {
      const response = await axiosInstance.get(`/tags/getAllTags`);
      const tagsData = response.data;
      set({ tags: tagsData });
    } catch (error) {
      console.error("Error fetching tags:", error);
      set({ tags: [] });
    }
  },
}));

export default useTagStore;
