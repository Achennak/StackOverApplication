import { useEffect, useState } from "react";
import useQuestionStore from "../store/questionStore";
import QuestionCard from "../components/QuestionCard";
import useUserStore from "../store/userStore";
import { Link, useNavigate } from "react-router-dom";

const HomePage = () => {
  const fetchQuestions = useQuestionStore((state) => state.fetchQuestions);
  const questions = useQuestionStore((state) => state.questions);
  const user = useUserStore((state) => state.user);
  const checkAuth = useUserStore((state) => state.checkAuth);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const [searchQuery, setSearchQuery] = useState("");
  const logout = useUserStore((state) => state.logout);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      fetchQuestions();
    }
  }, [fetchQuestions, isAuthenticated, navigate]);

  if (!user) {
    checkAuth();
    return null; // Return null or a loading state while checking authentication
  }

  const handleUserClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  //TODO: filter questions based on search string

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold" data-testId="home-page-title">
          Questions
        </h1>
        {user && (
          <div className="relative">
            <button onClick={handleUserClick}>
              <img
                src={user.avatar}
                alt="User Avatar"
                className="w-10 h-10 rounded-full"
                data-testId="user-img"
              />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
                <ul>
                  <li>
                    <Link
                      to="/profile"
                      className="block py-2 px-4 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Visit Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      className="block w-full text-left py-2 px-4 hover:bg-gray-100"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      <input
        type="text"
        placeholder="Search questions..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 px-4 py-2 border border-gray-300 rounded-md"
        data-testId="home-page-search-box"
      />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {questions.map((question) => (
          <QuestionCard key={question.id} question={question} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
