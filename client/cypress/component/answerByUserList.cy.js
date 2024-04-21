import React from "react";
import AnswersByUserList from "../../src/components/AnswersByUserList";

describe("AnswersByUserList", () => {
  it("renders an empty grid when no answers are provided", () => {
    cy.mount(<AnswersByUserList answers={[]} />);
    cy.get(".grid div").should("not.exist");
  });

  it("renders answers correctly", () => {
    const answers = [
      { id: 1, text: "This is the first answer." },
      { id: 2, text: "This is a longer answer that should be truncated." },
      { id: 3, text: "This is the third answer." },
    ];

    cy.mount(<AnswersByUserList answers={answers} />);

    // Check if the correct number of answer cards is rendered
    cy.get(".grid div").should("have.length", answers.length);

    // Check if the answer text is rendered correctly (truncated if necessary)
    answers.forEach((answer, index) => {
      const truncatedText =
        answer.text.length > 100
          ? `${answer.text.substring(0, 100)}...`
          : answer.text;
      cy.get(".grid div").eq(index).should("contain", truncatedText);
    });
  });

  it("applies correct styles to answer cards", () => {
    const answers = [{ id: 1, text: "This is an answer." }];

    cy.mount(<AnswersByUserList answers={answers} />);

    cy.get(".grid div")
      .should("have.class", "bg-white")
      .and("have.class", "rounded-lg")
      .and("have.class", "shadow-md")
      .and("have.class", "p-4");
  });
});
