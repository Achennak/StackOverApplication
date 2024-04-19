// HomePage.js
import { useEffect, useState } from "react";
import useQuestionStore from "../store/questionStore";
import QuestionCard from "../components/QuestionCard";
import useUserStore from "../store/userStore";
import { useNavigate, useLocation } from "react-router-dom";
import TopBar from "../components/topbar";
import Sidebar from "../components/sidebar";
import TagCard from "../components/TagCard";
import { filterAndSortQuestions } from "../utils";
import useTagStore from "../store/tagStore";

const HomePage = () => {
  const fetchQuestions = useQuestionStore((state) => state.fetchQuestions);
  const questions = useQuestionStore((state) => state.questions);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const [searchQuery, setSearchQuery] = useState("");
  const fetchTags = useTagStore((state) => state.fetchTags);
  const tags = useTagStore((state) => state.tags);
  const [filteredQuestions, setFilteredQuestions] = useState(questions);
  const [order, setOrder] = useState("active");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) {
        navigate("/login");
      } else {
        await fetchQuestions();
        await fetchTags();
      }
    };

    fetchData();
  }, [fetchQuestions, fetchTags, isAuthenticated, navigate]);

  useEffect(() => {
    const updateFilteredQuestions = async () => {
      const filteredAndSortedQuestions = await filterAndSortQuestions(
        order,
        searchQuery
      );
      setFilteredQuestions(filteredAndSortedQuestions);
    };

    updateFilteredQuestions();
  }, [questions, searchQuery, order]);

  const handleTagClick = (tagName) => {
    setSearchQuery(`[${tagName}]`);
    navigate("/");
  };

  const handleTabClick = (tab) => {
    setOrder(tab);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <div className="flex flex-grow">
        <Sidebar />
        <div className="flex-grow container py-8 m-5">
          <div className="flex items-center justify-between mb-4">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md"
              data-testId="home-page-search-box"
            />
            <div className="ml-4">
              <button
                onClick={() => handleTabClick("active")}
                className={`px-4 py-2 rounded-md ${
                  order === "active" ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => handleTabClick("new")}
                className={`px-4 py-2 rounded-md ml-2 ${
                  order === "new" ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                New
              </button>
              <button
                onClick={() => handleTabClick("unanswered")}
                className={`px-4 py-2 rounded-md ml-2 ${
                  order === "unanswered"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                Unanswered
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {location.pathname === "/tags"
              ? tags.map((tag, index) => (
                  <TagCard
                    key={index}
                    tagName={tag.tagName}
                    numQuestions={
                      questions.filter((q) =>
                        q.tagIds.some((tagId) => tagId.tagName === tag.tagName)
                      ).length
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
