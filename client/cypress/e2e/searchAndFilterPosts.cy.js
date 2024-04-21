describe("Search And Filter Posts", () => {
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
  it("Search for text", () => {
    // Type "quick" in the search box
    cy.get('[data-testid="home-page-search-box"]').type("quick");

    // Wait for the search results to load
    cy.wait(2000);

    // Confirm that there is exactly one question card present
    cy.get('[data-testid="question-card"]').should("have.length", 1);

    // Verify that the correct question card title is displayed
    cy.get('[data-testid="question_card_title"]').contains(
      "Quick question about storage on android"
    );
  });
  it("Search for tag", () => {
    // Search for javascript
    cy.get('[data-testid="home-page-search-box"]').type("[javascript]");

    // Wait for the search results to load
    cy.wait(2000);

    // Confirm that there is exactly 2 question card present
    cy.get('[data-testid="question-card"]').should("have.length", 2);
  });
  it("Search for text & tag", () => {
    // Search for storage[react]
    cy.get('[data-testid="home-page-search-box"]').type("storage[react]");

    // Wait for the search results to load
    cy.wait(2000);

    // Confirm that there is exactly 2 question card present
    cy.get('[data-testid="question-card"]').should("have.length", 3);
  });
  it("Filter new Posts", () => {
    cy.get('[data-testid="new-questions-filter-button"]').click();

    cy.wait(2000);

    // Find the first question card title and verify its text content
    cy.get('[data-testid="question_card_title"]')
      .first()
      .contains("Quick question about storage on android");
  });
  it("Filter for unanswered posts", () => {
    //Create new question
    cy.get('[data-testid="ask-new-question-button"]').click();

    cy.get('[data-testid="new-question-modal-title"]').type("Test Title");

    cy.get('[data-testid="new-question-modal-text"]').type("Test Text");

    cy.get('[data-testid="new-question-modal-tags"]').type("react express");

    cy.get('[data-testid="new-question-modal-submit-button"]').click();

    //wait
    cy.wait(2000);

    //click on unanswered button
    cy.get('[data-testid="unanswered-questions-filter-button"]').click();

    //there should be a single question card
    cy.get('[data-testid="question-card"]').should("have.length", 1);

    cy.get('[data-testid="question_card_title"]').contains("Test Title");
  });
});
