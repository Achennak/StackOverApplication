import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt, FaHeart, FaRegHeart } from "react-icons/fa";
import useQuestionStore from "../store/questionStore";
import { getFormattedDate } from "../utils";

const QuestionCard = ({ question, handleTagClick, currentUser }) => {
  const {
    _id,
    title,
    text,
    tagIds,
    answerIds,
    createdBy,
    creationDate,
    likedBy,
  } = question;
  const navigate = useNavigate();
  const likeQuestion = useQuestionStore((state) => state.likeQuestion);
  const dislikeQuestion = useQuestionStore((state) => state.dislikeQuestion);
  const deleteQuestion = useQuestionStore((state) => state.deleteQuestion);

  const [liked, setLiked] = useState(false);

  const handleQuestionClick = () => {
    navigate(`/question/${_id}`);
  };

  useEffect(() => {
    if (currentUser && question.likedBy.includes(currentUser._id)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [currentUser, question.likedBy]);

  // TODO: Use the util function instead
  const formattedDate = getFormattedDate(new Date(creationDate));

  const handleLike = () => {
    if (liked) {
      dislikeQuestion(_id, currentUser._id);
    } else {
      likeQuestion(_id, currentUser._id);
    }
    setLiked(!liked);
  };

  const handleQuestionDelete = () => {
    deleteQuestion(_id);
  };

  return (
    <div
      className="bg-white shadow-md rounded-lg p-6 relative"
      data-testid="question-card"
    >
      {currentUser.isAdmin || createdBy._id === currentUser._id ? (
        <FaTrashAlt
          className="absolute top-2 right-2 text-gray-500 cursor-pointer"
          onClick={() => handleQuestionDelete()}
        />
      ) : null}
      <h2
        className="text-xl font-bold mb-4 cursor-pointer"
        onClick={handleQuestionClick}
        data-testid="question_card_title"
      >
        {title}
      </h2>
      <p
        className="text-gray-700 mb-4 cursor-pointer"
        onClick={handleQuestionClick}
      >
        {text}
      </p>
      <div className="flex flex-wrap mb-4">
        {tagIds.map((tagId) => (
          <span
            key={tagId._id}
            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 cursor-pointer"
            onClick={() => handleTagClick(tagId.tagName)}
          >
            {tagId.tagName}
          </span>
        ))}
      </div>
      <div className="flex flex-col items-center text-sm text-gray-500">
        <span>Asked by {createdBy.userName}</span>
        <span>{formattedDate}</span>
      </div>
      <div className="flex items-center mt-4">
        <div
          className="flex items-center mr-4 cursor-pointer"
          onClick={handleLike}
        >
          {liked ? (
            <FaHeart className="text-red-500 mr-2" />
          ) : (
            <FaRegHeart className="text-gray-500 mr-2" />
          )}
          <span>{likedBy.length}</span>
        </div>
        <div className="ml-auto">
          <span className="text-gray-500">{answerIds.length} Answers</span>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
