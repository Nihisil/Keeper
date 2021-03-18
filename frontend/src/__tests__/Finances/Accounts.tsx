import { getAllByRole, render, screen } from "@testing-library/react";
import Accounts from "components/Finances/Accounts/Accounts";
import React from "react";

// TODO add mocks for tests data
it("renders list of accounts", () => {
  render(<Accounts accounts={[]} dispatchAccounts={() => {}} />);
  expect(screen.getByText("Accounts")).toBeInTheDocument();

  const table = screen.getByTestId("accounts-table");
  const rows = getAllByRole(table, "row");

  expect(rows.length).toEqual(2);
});
