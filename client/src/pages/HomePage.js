// HomePage.js
import { useEffect, useState } from "react";
import useQuestionStore from "../store/questionStore";
import QuestionCard from "../components/QuestionCard";
import useUserStore from "../store/userStore";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/topbar";
import Sidebar from "../components/sidebar";
import { filterQuestions } from "../utils";

const HomePage = () => {
  const fetchQuestions = useQuestionStore((state) => state.fetchQuestions);
  const questions = useQuestionStore((state) => state.questions);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredQuestions, setFilteredQuestions] = useState(questions);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      fetchQuestions();
    }
  }, [fetchQuestions, isAuthenticated, navigate]);

  useEffect(() => {
    setFilteredQuestions(filterQuestions(questions, searchQuery));
  }, [questions, searchQuery]);

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <div className="flex flex-grow">
        <Sidebar />
        <div className="flex-grow container py-8 m-5">
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4 px-4 py-2 border border-gray-300 rounded-md"
            data-testId="home-page-search-box"
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredQuestions.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
