describe("Vote on posts", () => {
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
  it("Like a post", () => {
    // verify likes are 0
    cy.get('[data-testid="question-card-number-of-likes"]')
      .first()
      .contains("0");

    cy.get('[data-testid="question-card-like-button"]').first().click();

    cy.wait(2000);

    // verify likes are now 1
    cy.get('[data-testid="question-card-number-of-likes"]')
      .first()
      .contains("1");

    // verify button changed to dislike
    cy.get('[data-testid="question-card-dislike-button"]')
      .first()
      .should("exist");
  });

  it("Unlike a post", () => {
    // verify likes are 0
    cy.get('[data-testid="question-card-number-of-likes"]')
      .first()
      .contains("0");

    cy.get('[data-testid="question-card-like-button"]').first().click();

    cy.wait(2000);

    // verify likes are now 1
    cy.get('[data-testid="question-card-number-of-likes"]')
      .first()
      .contains("1");

    // verify button changed to dislike
    cy.get('[data-testid="question-card-dislike-button"]')
      .first()
      .should("exist");

    //click on dsilike
    cy.get('[data-testid="question-card-dislike-button"]').first().click();

    cy.wait(2000);

    // verify likes are 0
    cy.get('[data-testid="question-card-number-of-likes"]')
      .first()
      .contains("0");

    //verify like button now exists
    cy.get('[data-testid="question-card-like-button"]').first().should("exist");
  });
});
