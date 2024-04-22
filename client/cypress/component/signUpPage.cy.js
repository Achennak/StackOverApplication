import React from "react";
import { MemoryRouter } from "react-router-dom";
import SignupPage from "../../src/pages/SignupPage";

describe("SignupPage", () => {
  beforeEach(() => {
    // Mock the useUserStore hook
    cy.window().then((window) => {
      window.zustandStore = {
        userStore: {
          state: {
            signUp: cy.stub().resolves(null),
          },
          getState: () => window.zustandStore.userStore.state,
          subscribe: cy.stub(),
          setState: cy.stub(),
          destroy: cy.stub(),
        },
        useUserStore: () => window.zustandStore.userStore,
      };
    });
  });

  it("User name input should be visible", () => {
    cy.mount(
      <MemoryRouter>
        <SignupPage />
      </MemoryRouter>
    );

    cy.get('[data-testid="username-input-field"]').should("be.visible");
    cy.contains("Sign Up").should("be.visible");
  });

  it("Email input should be visible", () => {
    cy.mount(
      <MemoryRouter>
        <SignupPage />
      </MemoryRouter>
    );

    cy.get('[data-testid="email-input-field"]').should("be.visible");
    cy.contains("Sign Up").should("be.visible");
  });

  it("Password input should be visible", () => {
    cy.mount(
      <MemoryRouter>
        <SignupPage />
      </MemoryRouter>
    );

    cy.get('[data-testid="password-input-field"]').should("be.visible");
    cy.contains("Sign Up").should("be.visible");
  });
});
