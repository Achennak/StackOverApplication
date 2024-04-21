describe("View Questions", () => {
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

    //Open Question Detail page of 1st question
    cy.get('[data-testid="question_card_title"]').first().click();
  });
  it("Verify title exists", () => {
    cy.get('[data-testid="question-detail-page-question-title"]').should(
      "exist"
    );
  });
  it("Verify text exists", () => {
    cy.get('[data-testid="question-detail-page-question-text"]').should(
      "exist"
    );
  });
  it("Like question and verify Likes increases", () => {
    //Verify question has not been liked
    cy.get('[data-testid="question-detail-page-dislike-button"]').should(
      "not.exist"
    );
    cy.get('[data-testid="question-detail-page-number-of-likes"]').contains(
      "Likes: 0"
    );

    //like the question
    cy.get('[data-testid="question-detail-page-like-button"]').click();

    cy.wait(2000);
    cy.get('[data-testid="question-detail-page-number-of-likes"]').contains(
      "Likes: 1"
    );
  });
  it("Delete and verify question disappears", () => {
    //Verify the question title
    cy.get('[data-testid="question-detail-page-question-title"]').contains(
      "Programmatically navigate using React router"
    );
    //Delete the question
    cy.get(
      '[data-testid="question-detail-page-question-delete-button"]'
    ).click();

    //Verify the question is not present anymore
    cy.get('[data-testid="question_card_title"]')
      .first()
      .contains("android studio");
  });
});
