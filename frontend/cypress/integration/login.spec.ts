interface UserProps {
  username: string;
  password: string;
}

type LoginTestCtx = {
  user: UserProps;
};

context("Login form", () => {
  const ctx: LoginTestCtx = { user: { username: "", password: "" } };

  beforeEach(() => {
    /* eslint-disable @typescript-eslint/no-explicit-any  */
    cy.task("db:seed").then((data: any) => {
      ctx.user = data.user;
    });
  });

  it("should display login fields validation errors", () => {
    cy.visit("/");

    cy.getBySel("login-submit-button").click();

    cy.getBySel("login-username-error").should("be.visible").and("contain", "Username is required");
    cy.getBySel("login-password-error").should("be.visible").and("contain", "Enter your password");
    cy.getBySel("login-submit-button").should("be.disabled");

    cy.getBySel("login-username-input").type("User").blur();
    cy.getBySel("login-password-input").type("abc").blur();

    cy.getBySel("login-submit-button").should("not.be.disabled");
  });

  it("should error for an invalid user", () => {
    cy.visit("/");

    cy.getBySel("login-username-input").type("invalid").blur();
    cy.getBySel("login-password-input").type("invalid").blur();

    cy.getBySel("login-submit-button").click();

    cy.getBySel("login-error-message").should("be.visible").and("contain", "Username or password is invalid");
  });

  it("should show home page content after successful login", () => {
    cy.visit("/");

    cy.getBySel("login-username-input").type(ctx.user.username).blur();
    cy.getBySel("login-password-input").type(ctx.user.password).blur();

    cy.getBySel("login-submit-button").click();

    cy.getBySel("home-page-title").and("contain", "Hi there");
  });
});
