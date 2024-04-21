const TagCard = ({ tagName, numQuestions, handleTagClick }) => {
  return (
    <div
      className="bg-white shadow-md rounded-lg p-6 cursor-pointer flex flex-col justify-center items-center w-48 h-48 text-center hover:bg-gray-100 transition duration-300"
      onClick={() => handleTagClick(tagName)}
    >
      <h2 className="text-xl font-semibold">{tagName}</h2>
      <p className="text-gray-600">{numQuestions} Questions</p>
    </div>
  );
};

export default TagCard;
