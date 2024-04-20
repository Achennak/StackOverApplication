describe("Home Page", () => {
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
  });
  it("user image is present", () => {
    // Replace this with logic
    const isAuthenticated = true;

    if (isAuthenticated) {
      cy.get('[data-testid="user-img"]').should("exist");
    } else {
      cy.get('[data-testid="user-img"]').should("not.exist");
    }
  });
  it("Search box is present", () => {
    // Visit the home page
    // cy.visit("http://localhost:3000/");

    // Replace this with logic
    const isAuthenticated = true;

    if (isAuthenticated) {
      cy.get('[data-testid="home-page-search-box"]').should("exist");
    } else {
      cy.get('[data-testid="home-page-search-box"]').should("not.exist");
    }
  });
  //TODO: Check for question card
  //TODO: Check if search works
  //TODO: Check for onClick events
});
