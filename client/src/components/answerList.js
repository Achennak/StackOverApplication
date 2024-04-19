// AnswerList.js
import useAnswerStore from "../store/answerStore";

const AnswerList = ({ answers }) => {
  const likeAnswer = useAnswerStore((state) => state.likeAnswer);
  const dislikeAnswer = useAnswerStore((state) => state.dislikeAnswer);

  const handleLike = (answerId, userId) => {
    likeAnswer(answerId, userId);
  };

  const handleDislike = (answerId, userId) => {
    dislikeAnswer(answerId, userId);
  };

  return (
    <div>
      {answers &&
        answers.map((answer) => (
          <div
            key={answer._id}
            className="bg-white p-4 mb-4 rounded-lg shadow-sm"
          >
            <p className="text-gray-800 mb-4 text-lg">{answer.text}</p>
            <div className="flex items-center">
              <button
                className="px-3 py-2 bg-green-500 text-white rounded-md mr-2"
                onClick={() => handleLike(answer._id, answer.userId)}
              >
                Like
              </button>
              <button
                className="px-3 py-2 bg-red-500 text-white rounded-md"
                onClick={() => handleDislike(answer._id, answer.userId)}
              >
                Dislike
              </button>
              <span className="text-gray-600 ml-4">
                {answer.likedBy.length} likes
              </span>
            </div>
          </div>
        ))}
    </div>
  );
};

export default AnswerList;
