import TopBar from "../components/topbar";
import Sidebar from "../components/sidebar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useUserStore from "../store/userStore";
import AnswersByUserList from "../components/AnswersByUserList";
import QuestionsByUserList from "../components/QuestionsByUserList";

const ProfilePage = () => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const fetchUser = useUserStore((state) => state.fetchUser);
  const fetchQuestionsByUserId = useUserStore(
    (state) => state.fetchQuestionsByUserId
  );
  const fetchAnswersByUserId = useUserStore(
    (state) => state.fetchAnswersByUserId
  );
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const [userData, setUserData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [activeTab, setActiveTab] = useState("questions"); // Default to 'questions' tab

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      fetchUser();
    }
  }, [isAuthenticated, navigate, fetchUser]);

  useEffect(() => {
    console.log(user);
    if (user) {
      setUserData(user);
      fetchQuestionsByUserId(user._id)
        .then((questions) => setQuestions(questions))
        .catch((error) => console.error("Error fetching questions:", error));

      fetchAnswersByUserId(user._id)
        .then((answers) => setAnswers(answers))
        .catch((error) => console.error("Error fetching answers:", error));
    }
  }, [user, fetchQuestionsByUserId, fetchAnswersByUserId]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "questions":
        return <QuestionsByUserList questions={questions} />;
      case "answers":
        return <AnswersByUserList answers={answers} />;
      default:
        return null;
    }
  };

  const renderUserData = () => {
    if (userData) {
      return (
        <div className="flex flex-col">
          <div className="flex items-center mb-4">
            <img
              src={userData.avatar}
              alt="Profile"
              className="w-12 h-12 rounded-full ml-4 mr-2" // Added margin to the right side of the image
            />
            <div>
              <h1 className="text-xl font-bold">{userData.userName}</h1>
              <p className="text-gray-500">{userData.email}</p>
              <p className="text-gray-500">
                Member since {new Date(userData.joinDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      );
    } else {
      return <p>Loading user data...</p>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <div className="flex flex-grow">
        <Sidebar />
        <div className="flex flex-col flex-grow p-8">
          {userData && (
            <div>
              {renderUserData()}
              <div className="flex mb-4">
                <button
                  className={`mr-2 px-4 py-2 ${
                    activeTab === "questions"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  } rounded`}
                  onClick={() => handleTabChange("questions")}
                >
                  Questions
                </button>
                <button
                  className={`px-4 py-2 ${
                    activeTab === "answers"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  } rounded`}
                  onClick={() => handleTabChange("answers")}
                >
                  Answers
                </button>
              </div>
            </div>
          )}
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
