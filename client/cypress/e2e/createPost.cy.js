describe("Create question", () => {
  beforeEach(() => {
    cy.exec("node ../server/init.js mongodb://127.0.0.1:27017/fake_so");
  });

  afterEach(() => {
    cy.exec("node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so");
  });
  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
    cy.get('[data-testId="email-input-field"]').type("test@test.com");
    cy.get('[data-testId="password-input-field').type("1234");
    cy.get("button[type=submit").click();
    cy.wait(2000);
  });
  it("Verify add question button exists", () => {
    cy.get('[data-testid="ask-new-question-button"]').should("exist");
  });
  it("Title validation", () => {
    //Click button
    cy.get('[data-testid="ask-new-question-button"]').click();

    //Enter body
    cy.get('[data-testid="new-question-modal-text"]').type("Test text");

    //Enter tags
    cy.get('[data-testid="new-question-modal-tags"]').type("react express");

    //Submit
    cy.get('[data-testid="new-question-modal-submit-button"]').click();

    cy.wait(1000);
    //Error message should show up
    cy.get('[data-testid="new-question-modal-title-error"]').should("exist");
  });
  it("Text validation", () => {
    //Click button
    cy.get('[data-testid="ask-new-question-button"]').click();

    //Enter title
    cy.get('[data-testid="new-question-modal-title"]').type("Test title");

    //Enter tags
    cy.get('[data-testid="new-question-modal-tags"]').type("react express");

    //Submit
    cy.get('[data-testid="new-question-modal-submit-button"]').click();

    cy.wait(1000);
    //Error message should show up
    cy.get('[data-testid="new-question-modal-text-error"]').should("exist");
  });
  it("Tag validation", () => {
    //Click button
    cy.get('[data-testid="ask-new-question-button"]').click();

    //Enter title
    cy.get('[data-testid="new-question-modal-title"]').type("Test title");

    //Enter body
    cy.get('[data-testid="new-question-modal-text"]').type("Test text");

    //Submit
    cy.get('[data-testid="new-question-modal-submit-button"]').click();

    cy.wait(1000);
    //Error message should show up
    cy.get('[data-testid="new-question-modal-tags-error"]').should("exist");
  });
  it("Success scenario", () => {
    //Create new question
    cy.get('[data-testid="ask-new-question-button"]').click();

    cy.get('[data-testid="new-question-modal-title"]').type("Test Title");

    cy.get('[data-testid="new-question-modal-text"]').type("Test Text");

    cy.get('[data-testid="new-question-modal-tags"]').type("react express");

    cy.get('[data-testid="new-question-modal-submit-button"]').click();

    //wait
    cy.wait(2000);

    cy.get('[data-testid="question_card_title"]').last().contains("Test Title");
  });
});
