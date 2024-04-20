import { FaUserCircle } from "react-icons/fa";
import TopBar from "../components/topbar";
import Sidebar from "../components/sidebar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useUserStore from "../store/userStore";

const ProfilePage = () => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const fetchUser = useUserStore((state) => state.fetchUser);
  const navigate = useNavigate();
  const fetchQuestionsByUserId = useUserStore((state) => state.fetchQuestionsByUserId);
  const fetchAnswersByUserId = useUserStore((state) => state.fetchAnswersByUserId);
  const user = useUserStore((state) => state.user);
  const [userData, setUserData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      fetchUser();
    }
  }, [isAuthenticated, navigate, fetchUser]);


  const fetchQuestions = async () => {
    if (user) {
      const questionsData = await fetchQuestionsByUserId(user._id);
      setQuestions(questionsData);
    }
  };

  const fetchAnswers = async () => {
    if (user) {
      const answersData = await fetchAnswersByUserId(user._id);
      setAnswers(answersData);
    }
  };

  useEffect(() => {
    if (user) {
      setUserData(user);
      fetchQuestions();
      fetchAnswers();
    }
  }, [user]);



 

  const renderUserData = () => {
    if (userData) {
      return (
        <div className="flex flex-col items-center mb-8">
          <FaUserCircle className="text-6xl text-gray-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">{userData.userName}</h1>
          <p className="text-gray-500 mb-1">{userData.email}</p>
          <p className="text-gray-500">
            Member since {new Date(userData.joinDate).toLocaleDateString()}
          </p>
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
              <div>
              <h2 className="text-xl font-bold mb-4">Questions</h2>
                <div className="grid grid-cols-1 gap-4">
                {questions.length > 0 ? (
                    questions.map((question) => (
                      <div
                        key={question.id}
                        className="bg-white rounded-md shadow-md p-4 hover:shadow-lg cursor-pointer transition duration-300"
                      >
                        <h3 className="text-lg font-semibold">{question.title}</h3>
                      </div>
                    ))
                  ) : (
                    <p>No questions by this user.</p>
                  )}
                </div>
              </div>
              <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Answers</h2>
                <div className="grid grid-cols-1 gap-4">
                {answers.length > 0 ? (
                    answers.map((answer) => (
                      <div
                        key={answer.id}
                        className="bg-white rounded-md shadow-md p-4 hover:shadow-lg cursor-pointer transition duration-300"
                      >
                        <h3 className="text-lg font-semibold">{answer.text}</h3>
                      </div>
                    ))
                  ) : (
                    <p>No answers by this user.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
