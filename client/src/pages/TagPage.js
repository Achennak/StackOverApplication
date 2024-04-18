import { useEffect } from "react";
import useQuestionStore from "../store/questionStore";
import useTagStore from "../store/tagStore";
import useUserStore from "../store/userStore";
import { useNavigate } from "react-router";
import TopBar from "../components/topbar";
import Sidebar from "../components/sidebar";

const TagPage = () => {
  const fetchQuestions = useQuestionStore((state) => state.fetchQuestions);
  // const questions = useQuestionStore((state) => state.questions);
  // const tags = useTagStore((state) => state.tags);
  const fetchTags = useTagStore((state) => state.fetchTags);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      fetchTags();
      fetchQuestions();
    }
  });

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <div className="flex flex-grow">
        <Sidebar />
        <div className="flex-grow container py-8 m-5">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            <div className="bg-white shadow-md rounded-lg p-6 cursor-pointer aspect-square w-36 h-36">
              Hey
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 cursor-pointer aspect-square w-36 h-36">
              Hey
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 cursor-pointer aspect-square w-36 h-36">
              Hey
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 cursor-pointer aspect-square w-36 h-36">
              Hey
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 cursor-pointer aspect-square w-36 h-36">
              Hey
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 cursor-pointer aspect-square w-36 h-36">
              Hey
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 cursor-pointer aspect-square w-36 h-36">
              Hey
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagPage;
