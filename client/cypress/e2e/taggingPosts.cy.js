describe("Tagging posts", () => {
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
  it("Clicking on tag question with that tag", () => {
    // navigate to tags page
    cy.get('[data-testid="sidebar-navigate-to-tags"]').click();
    cy.wait(2000);

    //click on first tagcard - react
    cy.get('[data-testid="tagcard-react"]').click();

    cy.wait(1000);

    //there should be a single question card
    cy.get('[data-testid="question-card"]').should("have.length", 1);

    cy.get('[data-testid="question_card_title"]').contains(
      "Programmatically navigate using React router"
    );
  });
  it("Click on tag on question card shows questions with that tag", () => {
    // click on react tag on the first question card
    cy.get('[data-testid="question-card-tag-react"]').click();

    cy.wait(1000);

    //there should be a single question card
    cy.get('[data-testid="question-card"]').should("have.length", 1);

    cy.get('[data-testid="question_card_title"]').contains(
      "Programmatically navigate using React router"
    );
  });
  it("create new question and check if tag card is populated", () => {
    //Create new question
    cy.get('[data-testid="ask-new-question-button"]').click();

    cy.get('[data-testid="new-question-modal-title"]').type("Test Title");

    cy.get('[data-testid="new-question-modal-text"]').type("Test Text");

    cy.get('[data-testid="new-question-modal-tags"]').type("mongoose");

    cy.get('[data-testid="new-question-modal-submit-button"]').click();

    //wait
    cy.wait(2000);

    // navigate to tags page
    cy.get('[data-testid="sidebar-navigate-to-tags"]').click();
    cy.wait(2000);

    //verify new tag exists
    cy.get('[data-testid="tagcard-mongoose"]').should("exist");
  });
});
