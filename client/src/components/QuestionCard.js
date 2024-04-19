import React from "react";
import { useNavigate } from "react-router-dom";

const QuestionCard = ({ question }) => {
  const { _id, title, text, tags } = question;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/question/${_id}`);
  };

  return (
    <div
      className="bg-white shadow-md rounded-lg p-6 cursor-pointer"
      onClick={handleClick}
    >
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <p className="text-gray-700 mb-4">{text}</p>
      <div className="flex flex-wrap">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
