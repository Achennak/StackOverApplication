describe("Create New Answer", () => {
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
  it("Error while creating new Answer", () => {
    // Click on first question
    cy.get('[data-testid="question_card_title"]').first().click();

    cy.wait(1000);

    //click on add answer button
    cy.get('[data-testid="question-detail-page-add-answer-button"]').click();

    //click on submit without any text
    cy.get('[data-testid="new-answer-modal-submit-button"]').click();

    // error text should be visible
    cy.get('[data-testid="new-answer-modal-text-error"]').should("exist");
  });
  it("Answer should be created successfully", () => {
    // Click on first question
    cy.get('[data-testid="question_card_title"]').first().click();

    cy.wait(1000);

    //click on add answer button
    cy.get('[data-testid="question-detail-page-add-answer-button"]').click();

    //type something
    cy.get('[data-testid="new-answer-modal-text"]').type("Test Answer");

    //submit answer
    cy.get('[data-testid="new-answer-modal-submit-button"]').click();

    cy.wait(2000);

    //confirm answer is posted
    cy.get('[data-testid="answerList-answer-text"]')
      .last()
      .contains("Test Answer");
  });
});
