// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// Import page components
import HomePage from "./pages/HomePage";
import QuestionDetailPage from "./pages/QuestionDetailPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/question/:id" element={<QuestionDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/tags" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default App;
