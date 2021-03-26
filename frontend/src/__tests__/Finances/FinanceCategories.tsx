import { getAllByRole, render, screen } from "@testing-library/react";
import FinanceCategories from "components/Finances/FinanceCategories/FinanceCategories";
import React from "react";

// TODO add mocks for tests data
it("renders list of accounts", () => {
  render(<FinanceCategories />);
  expect(screen.getByText("Finance Categories")).toBeInTheDocument();

  const table = screen.getByTestId("finance-categories-table");
  const rows = getAllByRole(table, "row");

  expect(rows.length).toEqual(2);
});
