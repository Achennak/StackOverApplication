import create from "zustand";
import axiosInstance from "../api/axiosInstance";
import { jwtDecode } from "jwt-decode";

const useUserStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  fetchUser: async () => {
    try {
      // Simulating an API call with dummy user data
      const dummyUser = {
        id: 1,
        username: "johndoe",
        email: "johndoe@example.com",
        avatar: "https://example.com/avatar.jpg",
      };
      set({ user: dummyUser });
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
      set({ isAuthenticated: true });
      set({ user: jwtDecode(token) });
    }
  },
}));

export default useUserStore;
