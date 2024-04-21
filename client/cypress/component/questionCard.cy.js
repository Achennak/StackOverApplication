import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import QuestionCard from "../../src/components/QuestionCard";

describe("QuestionCard", () => {
  const question = {
    _id: "1",
    title: "How to use React hooks?",
    text: "I want to learn how to use React hooks effectively.",
    tagIds: [
      { _id: "1", tagName: "react" },
      { _id: "2", tagName: "hooks" },
    ],
    answerIds: ["1", "2", "3"],
    createdBy: { _id: "123", userName: "testuser" },
    creationDate: "2023-05-01T10:00:00Z",
    likedBy: ["456", "789"],
  };

  const currentUser = {
    _id: "123",
    userName: "testuser",
    isAdmin: false,
  };

  it("renders question details correctly", () => {
    const handleTagClick = cy.stub();
    cy.mount(
      <Router>
        <QuestionCard
          question={question}
          currentUser={currentUser}
          handleTagClick={handleTagClick}
        />
      </Router>
    );

    cy.get('[data-testid="question_card_title"]').should(
      "contain",
      question.title
    );
    cy.contains(question.text).should("be.visible");
    cy.get(".bg-gray-200").should("have.length", question.tagIds.length);
    question.tagIds.forEach((tag) => {
      cy.contains(tag.tagName).should("be.visible");
    });
    cy.contains(`Asked by ${question.createdBy.userName}`).should("be.visible");
    cy.contains(`${question.likedBy.length}`).should("be.visible");
    cy.contains(`${question.answerIds.length} Answers`).should("be.visible");
  });

  it("does not render delete icon for non-admin and non-owner", () => {
    const handleTagClick = cy.stub();
    cy.mount(
      <Router>
        <QuestionCard
          question={question}
          currentUser={{ ...currentUser, _id: "456" }}
          handleTagClick={handleTagClick}
        />
      </Router>
    );

    cy.get('svg[data-icon="trash-alt"]').should("not.exist");
  });
});
