import React from "react";

const QuestionsByUserList = ({ questions }) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {questions.map((question) => (
          <div key={question.id} className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-xl font-semibold">{question.title}</h3>
            <p className="text-gray-500 mt-2">{question.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionsByUserList;
