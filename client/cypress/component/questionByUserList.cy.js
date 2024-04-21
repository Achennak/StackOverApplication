import React from "react";
import QuestionsByUserList from "../../src/components/QuestionsByUserList";

describe("QuestionsByUserList", () => {
  it("renders an empty grid when no questions are provided", () => {
    cy.mount(<QuestionsByUserList questions={[]} />);
    cy.get(".grid div").should("not.exist");
  });

  it("renders questions correctly", () => {
    const questions = [
      {
        id: 1,
        title: "How to use React hooks?",
        description: "I want to learn how to use React hooks effectively.",
      },
      {
        id: 2,
        title: "What is the difference between props and state?",
        description:
          "Can someone explain the difference between props and state in React?",
      },
      {
        id: 3,
        title: "How to optimize React app performance?",
        description:
          "I have a large React application, and I want to improve its performance.",
      },
    ];

    cy.mount(<QuestionsByUserList questions={questions} />);

    // Check if the correct number of question cards is rendered
    cy.get(".grid div").should("have.length", questions.length);

    // Check if the question title and description are rendered correctly
    questions.forEach((question, index) => {
      cy.get(".grid div")
        .eq(index)
        .should("contain", question.title)
        .and("contain", question.description);
    });
  });

  it("applies correct styles to question cards", () => {
    const questions = [
      {
        id: 1,
        title: "What is React?",
        description:
          "React is a JavaScript library for building user interfaces.",
      },
    ];

    cy.mount(<QuestionsByUserList questions={questions} />);

    cy.get(".grid div")
      .should("have.class", "bg-white")
      .and("have.class", "rounded-lg")
      .and("have.class", "shadow-md")
      .and("have.class", "p-4");
  });
});
