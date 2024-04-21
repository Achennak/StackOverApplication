import React from "react";
import AnswerList from "../../src/components/answerList";

describe("AnswerList", () => {
  it("renders empty list when no answers are provided", () => {
    cy.mount(<AnswerList answers={[]} />);
    cy.get(".bg-white").should("not.exist");
  });

  it("renders answers correctly", () => {
    const answers = [
      {
        _id: "1",
        text: "This is the first answer.",
        userId: "123",
        likedBy: ["456", "789"],
      },
      {
        _id: "2",
        text: "This is the second answer.",
        userId: "456",
        likedBy: ["789"],
      },
    ];

    cy.mount(<AnswerList answers={answers} />);

    // Check if the correct number of answers is rendered
    cy.get(".bg-white").should("have.length", answers.length);

    // Check if the answer text and like count are rendered correctly
    answers.forEach((answer, index) => {
      cy.get(".bg-white")
        .eq(index)
        .should("contain", answer.text)
        .and("contain", `${answer.likedBy.length} likes`);
    });
  });

  it("renders like and dislike buttons", () => {
    const answers = [
      {
        _id: "1",
        text: "This is an answer.",
        userId: "123",
        likedBy: [],
      },
    ];

    cy.mount(<AnswerList answers={answers} />);

    cy.get(".bg-green-500").should("exist").and("contain", "Like");
    cy.get(".bg-red-500").should("exist").and("contain", "Dislike");
  });
});
