// QuestionDetailPage.js
import { useParams } from "react-router-dom";
import useQuestionStore from "../store/questionStore";
import useAnswerStore from "../store/answerStore";
import AnswerList from "../components/answerList";
import { useEffect } from "react";
import TopBar from "../components/topbar";
import Sidebar from "../components/sidebar";

const QuestionDetailPage = () => {
  const { id } = useParams();
  const question = useQuestionStore((state) =>
    state.questions.find((question) => question.id === parseInt(id))
  );
  const fetchAnswers = useAnswerStore((state) => state.fetchAnswers);
  const answers = useAnswerStore((state) => state.answers);

  useEffect(() => {
    fetchAnswers(id);
  }, [fetchAnswers, id]);

  if (!question) {
    return (
      <div className="text-center text-2xl font-bold">Question Not Found</div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <div className="flex flex-grow">
        <Sidebar />
        <div className="flex-grow container py-8 m-5">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h1 className="text-3xl font-bold mb-4">{question.title}</h1>
            <p className="text-gray-700 mb-8 text-lg">{question.body}</p>
            <div className="border-t border-gray-300 pt-8">
              <h2 className="text-2xl font-bold mb-4">Answers</h2>
              <AnswerList answers={answers} questionId={id} />
            </div>
            <div className="border-t border-gray-300 pt-8">
              <h3 className="text-xl font-bold mb-4">Your Answer</h3>
              {/* TODO: Add a form to submit a new answer */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetailPage;
