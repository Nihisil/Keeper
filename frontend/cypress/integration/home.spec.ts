context("Home page", () => {
  it("shows login form by default", () => {
    cy.visit("/");
    cy.get("[data-cy=login-header]").invoke("text").should("equal", "Please log in");
  });
});
