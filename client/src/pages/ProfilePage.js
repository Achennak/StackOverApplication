import { FaUserCircle } from "react-icons/fa";
import TopBar from "../components/topbar";
import Sidebar from "../components/sidebar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useUserStore from "../store/userStore";

const QuestionCard = ({ question }) => {
  const navigate = useNavigate();
  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 mr-4 flex flex-col min-w-[300px] max-w-[400px]"
      onClick={() => {
        navigate(`/question/${question._id}`);
      }}
    >
      <h3 className="text-lg font-semibold mb-2">{question.title}</h3>
      <p className="text-gray-600">{question.text}</p>
    </div>
  );
};

const AnswerCard = ({ answer }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mr-4 flex flex-col min-w-[300px] max-w-[400px]">
      <p className="text-gray-600 mb-2">{answer.text}</p>
      <div className="flex items-center">
        {/* <img
          src={answer.user.avatarUrl}
          alt={answer.user.name}
          className="w-8 h-8 rounded-full mr-2"
        /> */}
        <span className="text-sm font-semibold">Test</span>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const fetchUser = useUserStore((state) => state.fetchUser);
  const navigate = useNavigate();
  const fetchQuestionsByUserId = useUserStore(
    (state) => state.fetchQuestionsByUserId
  );
  const fetchAnswersByUserId = useUserStore(
    (state) => state.fetchAnswersByUserId
  );
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
                <div className="flex overflow-x-auto pb-4">
                  {questions.length > 0 ? (
                    questions.map((question) => (
                      <QuestionCard key={question._id} question={question} />
                    ))
                  ) : (
                    <p>No questions by this user.</p>
                  )}
                </div>
              </div>
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Answers</h2>
                <div className="flex overflow-x-auto pb-4">
                  {answers.length > 0 ? (
                    answers.map((answer) => (
                      <AnswerCard key={answer._id} answer={answer} />
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
