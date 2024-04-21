import { MemoryRouter } from "react-router-dom";
import { create } from "zustand";
import TopBar from "../../src/components/topbar";

describe("TopBar", () => {
  let mockUser, mockLogout, mockNavigate;

  beforeEach(() => {
    // Mock the useNavigate hook
    mockNavigate = cy.stub().as("mockNavigate");
    cy.on("window:before:load", (win) => {
      cy.stub(win, "useNavigate").returns(mockNavigate);
    });

    // Mock the useUserStore hook
    const mockUserStore = create((set) => ({
      user: null,
      logout: () => {},
    }));
    mockUser = { username: "testuser" };
    mockLogout = cy.stub().as("mockLogout");
    cy.stub(mockUserStore, "getState")
      .returns({ user: mockUser, logout: mockLogout })
      .as("mockUserStore");
    cy.on("window:before:load", (win) => {
      win.useUserStore = mockUserStore;
    });
  });

  it("renders the TopBar component with user", () => {
    cy.mount(
      <MemoryRouter>
        <TopBar />
      </MemoryRouter>
    );

    cy.contains("Stack Overflow Clone").should("be.visible");
  });
});
