describe("Home Page", () => {
  it("user image is present", () => {
    // Visit the home page
    cy.visit("http://localhost:3000/");

    // Replace this with logic
    const isAuthenticated = true;

    if (isAuthenticated) {
      cy.get('[data-testid="user-img"]').should("exist");
    } else {
      cy.get('[data-testid="user-img"]').should("not.exist");
    }
  });
  it("Questions title is present", () => {
    // Visit the home page
    cy.visit("http://localhost:3000/");

    // Replace this with logic
    const isAuthenticated = true;

    if (isAuthenticated) {
      cy.get('[data-testid="home-page-title"]').should("exist");
    } else {
      cy.get('[data-testid="home-page-title"]').should("not.exist");
    }
  });
  it("Search box is present", () => {
    // Visit the home page
    cy.visit("http://localhost:3000/");

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
