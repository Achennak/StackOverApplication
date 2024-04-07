import create from "zustand";

const dummyUser = {
  id: 1,
  username: "johndoe",
  email: "johndoe@example.com",
  avatar: "https://static.thenounproject.com/png/6713881-200.png",
};

const useUserStore = create((set) => ({
  user: dummyUser,
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
}));

export default useUserStore;

// TODO: Deal with auth using JWT here like:
// import create from "zustand";
// import axios from "axios";
// import jwtDecode from "jwt-decode";

// const useUserStore = create((set) => ({
//   user: null,
//   isAuthenticated: false,
//   signIn: async (username, password) => {
//     try {
//       const response = await axios.post("/api/signin", { username, password });
//       const token = response.data.token;
//       localStorage.setItem("token", token);
//       set({ isAuthenticated: true });
//       set({ user: jwtDecode(token) });
//     } catch (error) {
//       console.error("Error signing in:", error);
//     }
//   },
//   signOut: () => {
//     localStorage.removeItem("token");
//     set({ user: null, isAuthenticated: false });
//   },
// checkAuth: () => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       const decodedToken = jwtDecode(token);
//       const currentTime = Date.now() / 1000; // Convert current time to Unix timestamp

//       if (decodedToken.exp > currentTime) {
//         set({ isAuthenticated: true });
//         set({ user: decodedToken });
//       } else {
//         // Token has expired
//         localStorage.removeItem("token");
//         set({ user: null, isAuthenticated: false });
//       }
//     }
//   },
// }));

// export default useUserStore;
