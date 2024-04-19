import { create } from "zustand";
import axiosInstance from "../api/axiosInstance";
import { jwtDecode } from "jwt-decode";

const useUserStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  fetchUser: async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const userId = jwtDecode(token).userId;

        const response = await axiosInstance.get(`/user/details/${userId}`);
        const userData = response.data;
        set({ isAuthenticated: true, user: userData });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      set({ isAuthenticated: false, user: null });
    }
  },
  signUp: async (userData) => {
    try {
      const response = await axiosInstance.post("/user/signup", userData);
      const token = response.data.token;
      localStorage.setItem("token", token);
      set({ isAuthenticated: true }); // Set isAuthenticated to true
      await get().fetchUser();
    } catch (error) {
      console.log("Error signing in", error);
      throw error;
    }
  },
  login: async (credentials) => {
    try {
      console.log(credentials);
      const response = await axiosInstance.post("/user/login", credentials);
      const token = response.data.token;
      localStorage.setItem("token", token);
      set({ isAuthenticated: true }); // Set isAuthenticated to true
      await get().fetchUser();
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, isAuthenticated: false });
  },
  checkAuth: () => {
    const token = localStorage.getItem("token");
    if (token) {
      const userId = token.userId;
      try {
        const response = axiosInstance.get(`/user/details/${userId}`);
        const userData = response.data;
        set({ isAuthenticated: true, user: userData });
      } catch (err) {
        console.error("Error fetching user:", err);
        set({ isAuthenticated: false, user: null });
      }
    } else {
      set({ isAuthenticated: false, user: null });
    }
  },
  fetchQuestionsByUserId: async (userId) => {
    try {
      const response = await axiosInstance.get(`/questions/getQuestionsByUserId/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  },
  fetchAnswersByUserId: async (userId) => {
    try {
      const response = await axiosInstance.get(`/answers/getAnswersByUserId/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching answers:', error);
      throw error;
    }
  }
}));

export default useUserStore;
