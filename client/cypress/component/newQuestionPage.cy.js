import React from "react";
import NewQuestionPage from "../../src/pages/NewQuestionPage";

describe("NewQuestionPage", () => {
  it("renders the modal", () => {
    const showModal = true;
    const setShowModal = cy.stub();
    const handleSubmit = cy.stub();
    const title = "";
    const setTitle = cy.stub();
    const titleError = "";
    const setTitleError = cy.stub();
    const text = "";
    const setText = cy.stub();
    const textError = "";
    const setTextError = cy.stub();
    const tags = "";
    const setTags = cy.stub();
    const tagsError = "";
    const setTagsError = cy.stub();

    cy.mount(
      <NewQuestionPage
        showModal={showModal}
        setShowModal={setShowModal}
        handleSubmit={handleSubmit}
        title={title}
        setTitle={setTitle}
        titleError={titleError}
        setTitleError={setTitleError}
        text={text}
        setText={setText}
        textError={textError}
        setTextError={setTextError}
        tags={tags}
        setTags={setTags}
        tagsError={tagsError}
        setTagsError={setTagsError}
      />
    );

    cy.get('[data-testid="new-question-modal-title"]').should("be.visible");
    cy.get('[data-testid="new-question-modal-text"]').should("be.visible");
    cy.get('[data-testid="new-question-modal-tags"]').should("be.visible");
    cy.get('[data-testid="new-question-modal-submit-button"]').should(
      "be.visible"
    );
  });

  it("displays error messages", () => {
    const showModal = true;
    const setShowModal = cy.stub();
    const handleSubmit = cy.stub();
    const title = "";
    const setTitle = cy.stub();
    const titleError = "Title is required";
    const setTitleError = cy.stub();
    const text = "";
    const setText = cy.stub();
    const textError = "Text is required";
    const setTextError = cy.stub();
    const tags = "";
    const setTags = cy.stub();
    const tagsError = "Tags are required";
    const setTagsError = cy.stub();

    cy.mount(
      <NewQuestionPage
        showModal={showModal}
        setShowModal={setShowModal}
        handleSubmit={handleSubmit}
        title={title}
        setTitle={setTitle}
        titleError={titleError}
        setTitleError={setTitleError}
        text={text}
        setText={setText}
        textError={textError}
        setTextError={setTextError}
        tags={tags}
        setTags={setTags}
        tagsError={tagsError}
        setTagsError={setTagsError}
      />
    );

    cy.get('[data-testid="new-question-modal-title-error"]').should(
      "contain.text",
      titleError
    );
    cy.get('[data-testid="new-question-modal-text-error"]').should(
      "contain.text",
      textError
    );
    cy.get('[data-testid="new-question-modal-tags-error"]').should(
      "contain.text",
      tagsError
    );
  });
});
