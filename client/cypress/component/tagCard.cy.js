import React from "react";
import TagCard from "../../src/components/TagCard";

describe("TagCard", () => {
  it("renders the tag name and question count", () => {
    const tagName = "JavaScript";
    const numQuestions = 10;
    const handleTagClick = cy.stub();

    cy.mount(
      <TagCard
        tagName={tagName}
        numQuestions={numQuestions}
        handleTagClick={handleTagClick}
      />
    );

    cy.contains(tagName).should("be.visible");
    cy.contains(`${numQuestions} Questions`).should("be.visible");
  });

  it("applies the correct styles", () => {
    const tagName = "React";
    const numQuestions = 5;
    const handleTagClick = cy.stub();

    cy.mount(
      <TagCard
        tagName={tagName}
        numQuestions={numQuestions}
        handleTagClick={handleTagClick}
      />
    );

    cy.get("div")
      .should("have.class", "bg-white")
      .and("have.class", "shadow-md")
      .and("have.class", "rounded-lg")
      .and("have.class", "p-6")
      .and("have.class", "cursor-pointer")
      .and("have.class", "flex")
      .and("have.class", "flex-col")
      .and("have.class", "justify-center")
      .and("have.class", "items-center")
      .and("have.class", "w-48")
      .and("have.class", "h-48")
      .and("have.class", "text-center");
  });

  it("calls the handleTagClick function when clicked", () => {
    const tagName = "Python";
    const numQuestions = 20;
    const handleTagClick = cy.stub();

    cy.mount(
      <TagCard
        tagName={tagName}
        numQuestions={numQuestions}
        handleTagClick={handleTagClick}
      />
    );

    cy.get("div.bg-white").click();
    cy.wrap(handleTagClick).should("have.been.calledWith", tagName);
  });
});
