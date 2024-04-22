import React from "react";
import { useEffect } from "react";

const NewQuestionPage = ({
  showModal,
  setShowModal,
  handleSubmit,
  title,
  setTitle,
  titleError,
  setTitleError,
  text,
  setText,
  textError,
  setTextError,
  tags,
  setTags,
  tagsError,
  setTagsError,
}) => {
  useEffect(() => {
    if (!showModal) {
      setTitle("");
      setText("");
      setTags("");
      setTitleError("");
      setTextError("");
      setTagsError("");
    }
  }, [showModal, setTitleError, setTextError, setTagsError]);
  return (
    showModal && (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Ask Question</h2>
          {titleError && (
            <p
              className="text-red-500 mb-2"
              data-testid="new-question-modal-title-error"
            >
              {titleError}
            </p>
          )}
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setTitleError("");
            }}
            className="mb-4 px-4 py-2 border border-gray-300 rounded-md w-full"
            data-testid="new-question-modal-title"
          />
          {textError && (
            <p
              className="text-red-500 mb-2"
              data-testid="new-question-modal-text-error"
            >
              {textError}
            </p>
          )}
          <textarea
            placeholder="Question text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setTextError("");
            }}
            className="mb-4 px-4 py-2 border border-gray-300 rounded-md w-full"
            data-testid="new-question-modal-text"
          ></textarea>
          {tagsError && (
            <p
              className="text-red-500 mb-2"
              data-testid="new-question-modal-tags-error"
            >
              {tagsError}
            </p>
          )}
          <input
            type="text"
            placeholder="Tags (space-separated)"
            value={tags}
            onChange={(e) => {
              setTags(e.target.value);
              setTagsError("");
            }}
            className="mb-4 px-4 py-2 border border-gray-300 rounded-md w-full"
            data-testid="new-question-modal-tags"
          />
          <div className="flex justify-end">
            <button
              onClick={() => {
                setShowModal(false);
                setTitleError("");
                setTextError("");
                setTagsError("");
              }}
              className="mr-4 px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
              data-testid="new-question-modal-submit-button"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default NewQuestionPage;
