import { render, screen } from "@testing-library/react";
import App from "components/App/App";
import React from "react";

it("renders login form by default for not auth user", () => {
  render(<App />);
  expect(screen.getByText("Please log in")).toBeInTheDocument();
});
