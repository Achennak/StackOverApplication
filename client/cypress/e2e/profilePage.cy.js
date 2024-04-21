describe("Profile page tests", () => {
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
  it("Check user has no question or answer", () => {
    // visit /profile
    cy.get('[data-testid="user-img"]').click();
    cy.get('[data-testid="topbar-visit-profile-button"]').click();

    //confirm no questions or users
    cy.get('[data-testid="profile-page-no-questions-text"]').should("exist");
    cy.get('[data-testid="profile-page-no-answers-text"]').should("exist");
  });
  it("Create question and verify it shows up", () => {
    //Create new question
    cy.get('[data-testid="ask-new-question-button"]').click();

    cy.get('[data-testid="new-question-modal-title"]').type("Test Title");

    cy.get('[data-testid="new-question-modal-text"]').type("Test Text");

    cy.get('[data-testid="new-question-modal-tags"]').type("react express");

    cy.get('[data-testid="new-question-modal-submit-button"]').click();

    //wait
    cy.wait(2000);

    // visit /profile
    cy.get('[data-testid="user-img"]').click();
    cy.get('[data-testid="topbar-visit-profile-button"]').click();

    //verify question exists
    cy.get('[data-testid="profile-page-question-title"]').should("exist");
  });
  it("Create answer and verify it shows up", () => {
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

    // visit /profile
    cy.get('[data-testid="user-img"]').click();
    cy.get('[data-testid="topbar-visit-profile-button"]').click();

    //verify answer exists
    cy.get('[data-testid="profile-page-answer-title"]').should("exist");
  });
  it("Create question and test onClick", () => {
    //Create new question
    cy.get('[data-testid="ask-new-question-button"]').click();

    cy.get('[data-testid="new-question-modal-title"]').type("Test Title");

    cy.get('[data-testid="new-question-modal-text"]').type("Test Text");

    cy.get('[data-testid="new-question-modal-tags"]').type("react express");

    cy.get('[data-testid="new-question-modal-submit-button"]').click();

    //wait
    cy.wait(2000);

    // visit /profile
    cy.get('[data-testid="user-img"]').click();
    cy.get('[data-testid="topbar-visit-profile-button"]').click();

    //verify question exists
    cy.get('[data-testid="profile-page-question-title"]').click();

    cy.wait(2000);

    //confirm we are on question detail page
    cy.get('[data-testid="question-detail-page-question-title"]').should(
      "exist"
    );
  });
});
