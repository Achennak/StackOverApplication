// QuestionDetailPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useQuestionStore from "../store/questionStore";
import useAnswerStore from "../store/answerStore";
import useUserStore from "../store/userStore";
import AnswerList from "../components/answerList";
import { FaTrashAlt, FaHeart, FaRegHeart } from "react-icons/fa";
import { getFormattedDate } from "../utils";
import TopBar from "../components/topbar";
import Sidebar from "../components/sidebar";
import NewAnswerPage from "./NewAnswerPage";
import { validateAskAnswer } from "../utils";

const QuestionDetailPage = () => {
  const { id } = useParams();
  const question = useQuestionStore((state) =>
    state.questions.find((question) => question._id === id)
  );
  const fetchAnswers = useAnswerStore((state) => state.fetchAnswers);
  const postAnswer = useAnswerStore((state) => state.postAnswer);
  const answers = useAnswerStore((state) => state.answers);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const currentUser = useUserStore((state) => state.user);
  const likeQuestion = useQuestionStore((state) => state.likeQuestion);
  const dislikeQuestion = useQuestionStore((state) => state.dislikeQuestion);
  const deleteQuestion = useQuestionStore((state) => state.deleteQuestion);
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [text, setText] = useState("");
  const [textError, setTextError] = useState("");

  const handleSubmit = async () => {
    const textError = validateAskAnswer(text);
    console.log(textError);
    setTextError(textError && textError.trim().length > 0 ? textError : "");

    if (textError && textError.trim().length > 0) {
      return;
    }
    await postAnswer({ id, text });
    setText("");
    setShowModal(false);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
    fetchAnswers(id);
  }, [fetchAnswers, id, isAuthenticated, navigate]);

  if (!question) {
    return (
      <div className="text-center text-2xl font-bold">Question Not Found</div>
    );
  }

  const formattedDate = getFormattedDate(new Date(question.creationDate));

  useEffect(() => {
    if (currentUser && question.likedBy.includes(currentUser._id)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [currentUser, question.likedBy]);

  const handleLike = async () => {
    if (liked) {
      await dislikeQuestion(id, currentUser._id);
    } else {
      await likeQuestion(id, currentUser._id);
    }
    setLiked(!liked);
  };

  const handleQuestionDelete = () => {
    deleteQuestion(id);
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <div className="flex flex-grow">
        <Sidebar />
        <div className="flex-grow container py-8 px-5">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h1
              className="text-3xl font-bold mb-4"
              data-testid="question-detail-page-question-title"
            >
              {question.title}
            </h1>
            <p
              className="text-gray-700 mb-8 text-lg"
              data-testid="question-detail-page-question-text"
            >
              {question.text}
            </p>
            <p className="text-gray-600">
              Asked by {question.createdBy.userName} on {formattedDate}
            </p>
            <div className="flex items-center space-x-4 mb-4">
              <div
                className="flex items-center mr-4 cursor-pointer"
                onClick={handleLike}
              >
                {liked ? (
                  <FaHeart
                    className="text-red-500 mr-2"
                    data-testid="question-detail-page-dislike-button"
                  />
                ) : (
                  <FaRegHeart
                    className="text-gray-500 mr-2"
                    data-testid="question-detail-page-like-button"
                  />
                )}
                {currentUser.isAdmin ||
                currentUser._id === question.createdBy._id ? (
                  <button
                    onClick={handleQuestionDelete}
                    className="text-gray-500 cursor-pointer"
                    data-testid="question-detail-page-question-delete-button"
                  >
                    <FaTrashAlt />
                  </button>
                ) : null}
              </div>
            </div>
            <p
              className="text-gray-600 mb-0"
              data-testid="question-detail-page-number-of-likes"
            >
              Likes: {question.likedBy.length}
            </p>
            <div className="border-t border-gray-300 pt-8">
              <h2 className="text-2xl font-bold mb-4">Answers</h2>
              <AnswerList answers={answers} questionId={id} />
            </div>
            <div className="border-t border-gray-300 pt-8">
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                data-testid="question-detail-page-add-answer-button"
              >
                Add Answer
              </button>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <NewAnswerPage
          showModal={showModal}
          setShowModal={setShowModal}
          handleSubmit={handleSubmit}
          text={text}
          setText={setText}
          textError={textError}
          setTextError={setTextError}
        />
      )}
    </div>
  );
};

export default QuestionDetailPage;
