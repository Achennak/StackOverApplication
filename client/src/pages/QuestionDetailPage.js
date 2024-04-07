import { useParams } from "react-router-dom";
import useQuestionStore from "../store/questionStore";

const QuestionDetailPage = () => {
  const { id } = useParams();
  const question = useQuestionStore((state) =>
    state.questions.find((question) => question.id === parseInt(id))
  );

  if (!question) {
    return <div>Question Not Found</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">{question.title}</h1>
      <p className="text-gray-700 mb-4">{question.body}</p>
      <h2 className="text-2xl font-bold mb-4">Answers</h2>
      {/* TODO: Deal with answers*/}
    </div>
  );
};

export default QuestionDetailPage;
