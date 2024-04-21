import React from "react";
import Sidebar from "../../src/components/sidebar";
import { MemoryRouter } from "react-router-dom";

describe("Sidebar component", () => {
  it("renders correctly", () => {
    cy.mount(
      <MemoryRouter initialEntries={["/"]}>
        <Sidebar />
      </MemoryRouter>
    );
    cy.get("aside").should("exist");
    cy.get("ul").should("exist");
    cy.get("li").should("have.length", 2);
  });

  it("highlights active link correctly", () => {
    cy.mount(
      <MemoryRouter initialEntries={["/"]}>
        <Sidebar />
      </MemoryRouter>
    );

    // Check if the "Questions" link is active when the path is "/"
    cy.get("li:first a")
      .should("have.class", "bg-blue-500")
      .and("have.class", "text-white");

    cy.mount(
      <MemoryRouter initialEntries={["/tags"]}>
        <Sidebar />
      </MemoryRouter>
    );

    // Check if the "Tags" link is active when the path is "/tags"
    cy.get("li:last a")
      .should("have.class", "bg-blue-500")
      .and("have.class", "text-white");
  });
});
