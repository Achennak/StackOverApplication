import React from "react";

const AnswersByUserList = ({ answers }) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {answers.map((answer) => (
          <div key={answer.id} className="bg-white rounded-lg shadow-md p-4">
            <p className="text-gray-700">
              {answer.text.length > 100
                ? answer.text.substring(0, 100) + "..."
                : answer.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnswersByUserList;
