describe("Post Moderation", () => {
  beforeEach(() => {
    cy.exec("node ../server/init.js mongodb://127.0.0.1:27017/fake_so");
  });

  afterEach(() => {
    cy.exec("node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so");
  });
  beforeEach(() => {});
  it("Delete button visible for admin user", () => {
    //Login as admin user
    cy.visit("http://localhost:3000/login");
    cy.get('[data-testId="email-input-field"]').type("test@test.com");
    cy.get('[data-testId="password-input-field').type("1234");
    cy.get("button[type=submit").click();
    cy.wait(2000);

    cy.get('[data-testid="question-card-delete-question-button"]').should(
      "exist"
    );
  });

  it("Delete button not available for regular user", () => {
    // create a new user
    cy.visit("http://localhost:3000/signup");
    cy.get('[data-testid="username-input-field"]').type("regular_user");
    cy.get('[data-testid="email-input-field"]').type("regular_user@test.com");
    cy.get('[data-testid="password-input-field"]').type('r9FYl5L*S28xs"K'); // 7 characters
    cy.get("button[type=submit]").click();

    cy.wait(2000);

    //verify login successful
    cy.get('[data-testid="question-card"]').should("exist");

    //verify delete button does not exist
    cy.get('[data-testid="question-card-delete-question-button"]').should(
      "not.exist"
    );
  });
  it("Delete button available for regular creator of post", () => {
    // create a new user
    cy.visit("http://localhost:3000/signup");
    cy.get('[data-testid="username-input-field"]').type("regular_user");
    cy.get('[data-testid="email-input-field"]').type("regular_user@test.com");
    cy.get('[data-testid="password-input-field"]').type('r9FYl5L*S28xs"K'); // 7 characters
    cy.get("button[type=submit]").click();

    cy.wait(2000);

    //verify login successful
    cy.get('[data-testid="question-card"]').should("exist");

    //Create new question
    cy.get('[data-testid="ask-new-question-button"]').click();

    cy.get('[data-testid="new-question-modal-title"]').type("Test Title");

    cy.get('[data-testid="new-question-modal-text"]').type("Test Text");

    cy.get('[data-testid="new-question-modal-tags"]').type("react express");

    cy.get('[data-testid="new-question-modal-submit-button"]').click();

    //wait
    cy.wait(2000);

    // delete button should be available now
    cy.get('[data-testid="question-card-delete-question-button"]').should(
      "exist"
    );
  });
});
