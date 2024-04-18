// HomePage.js
import { useEffect, useState } from "react";
import useQuestionStore from "../store/questionStore";
import QuestionCard from "../components/QuestionCard";
import useUserStore from "../store/userStore";
import { useNavigate, useLocation } from "react-router-dom";
import TopBar from "../components/topbar";
import Sidebar from "../components/sidebar";
import TagCard from "../components/TagCard";
import { filterQuestions } from "../utils";
import useTagStore from "../store/tagStore";

const HomePage = () => {
  const fetchQuestions = useQuestionStore((state) => state.fetchQuestions);
  const questions = useQuestionStore((state) => state.questions);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const [searchQuery, setSearchQuery] = useState("");
  const fetchTags = useTagStore((state) => state.fetchTags);
  const tags = useTagStore((state) => state.tags);
  const [filteredQuestions, setFilteredQuestions] = useState(questions);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      fetchQuestions();
      fetchTags();
    }
  }, [fetchQuestions, isAuthenticated, navigate]);

  useEffect(() => {
    setFilteredQuestions(filterQuestions(questions, searchQuery));
  }, [questions, searchQuery]);

  const handleTagClick = (tagName) => {
    setSearchQuery(`[${tagName}]`);
    navigate("/");
  };

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
            {location.pathname === "/tags"
              ? tags.map((tag, index) => (
                  <TagCard
                    key={index}
                    tagName={tag.tagName}
                    numQuestions={
                      questions.filter((q) => q.tags.includes(tag.tagName))
                        .length
                    }
                    handleTagClick={handleTagClick}
                  />
                ))
              : filteredQuestions.map((question) => (
                  <QuestionCard key={question.id} question={question} />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
