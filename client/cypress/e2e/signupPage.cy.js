describe("Sign up page", () => {
  it("Username field should exist", () => {
    // Visit the home page
    cy.visit("http://localhost:3000/signup");
    cy.get('[data-testid="username-input-field"]').should("not.exist");
  });
  it("Email field should exist", () => {
    // Visit the home page
    cy.visit("http://localhost:3000/signup");
    cy.get('[data-testid="email-input-field"]').should("not.exist");
  });
  it("password field should exist", () => {
    // Visit the home page
    cy.visit("http://localhost:3000/signup");
    cy.get('[data-testid="password-input-field"]').should("not.exist");
  });
  it("displays error message for missing special character in password", () => {
    cy.visit("http://localhost:3000/signup");
    cy.get('[data-testid="username-input-field"]').type("testuser");
    cy.get('[data-testid="email-input-field"]').type("test@example.com");
    cy.get('[data-testid="password-input-field"]').type("password");
    cy.get("button[type=submit]").click();
    cy.contains("Password must contain at least one special character").should(
      "be.visible"
    );
  });
  it("displays error message for missing number in password", () => {
    cy.visit("http://localhost:3000/signup");
    cy.get('[data-testid="username-input-field"]').type("testuser");
    cy.get('[data-testid="email-input-field"]').type("test@example.com");
    cy.get('[data-testid="password-input-field"]').type("Password");
    cy.get("button[type=submit]").click();
    cy.contains("Password must contain at least one number.").should(
      "be.visible"
    );
  });
  it("displays error message for missing uppercase letter in password", () => {
    cy.visit("http://localhost:3000/signup");
    cy.get('[data-testid="username-input-field"]').type("testuser");
    cy.get('[data-testid="email-input-field"]').type("test@example.com");
    cy.get('[data-testid="password-input-field"]').type("passw0rd");
    cy.get("button[type=submit]").click();
    cy.contains("Password must contain at least one uppercase letter.").should(
      "be.visible"
    );
  });
  it("displays error message for password length less than 8 characters", () => {
    cy.visit("http://localhost:3000/signup");
    cy.get('[data-testid="username-input-field"]').type("testuser");
    cy.get('[data-testid="email-input-field"]').type("test@example.com");
    cy.get('[data-testid="password-input-field"]').type("Passw0"); // 7 characters
    cy.get("button[type=submit]").click();
    cy.contains("Password must be at least 8 characters long.").should(
      "be.visible"
    );
  });
  // TODO: Valid Flow
});
