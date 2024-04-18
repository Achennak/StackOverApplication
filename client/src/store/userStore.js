import { create } from "zustand";
import axiosInstance from "../api/axiosInstance";
import { jwtDecode } from "jwt-decode";

const useUserStore = create((set) => ({
  user: localStorage.getItem("token")
    ? jwtDecode(localStorage.getItem("token"))
    : null,
  isAuthenticated: !!localStorage.getItem("token"),
  /* fetchUser: async () => {
    try {
      // Simulating an API call with dummy user data
      const dummyUser = {
        id: 1,
        userName: "johndoe",
        email: "johndoe@example.com",
        joinDate:Date.now(),
        avatar: "https://example.com/avatar.jpg",
      };
      set({ user: dummyUser });
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  },*/
  fetchUser: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const userId = jwtDecode(token).userId;

      const response = await axiosInstance.get(`/user/details/${userId}`);
      const userData = response.data;
      set({ user: userData });
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  },
  signUp: async (userData) => {
    try {
      const response = await axiosInstance.post("/user/signup", userData);
      const token = response.data.token;
      localStorage.setItem("token", token);
      set({ isAuthenticated: true });
      set({ user: jwtDecode(token) });
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
      set({ isAuthenticated: true });
      set({ user: jwtDecode(token) });
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
      set({ isAuthenticated: true, user: jwtDecode(token) });
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
