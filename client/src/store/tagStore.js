import { create } from "zustand";
// import axiosInstance from "../api/axiosInstance";

const tags = [
  {
    tagName: "react",
  },
  {
    tagName: "express",
  },
];

const useTagStore = create((set) => ({
  tags: [],
  fetchTags: () => {
    try {
      //   const response = axiosInstance.get(`/tags`);
      //   const tagsData = response.data;
      set({ tags: tags });
    } catch (error) {
      console.error("Error fetching tags:", error);
      set({ tags: [] });
    }
  },
}));

export default useTagStore;
