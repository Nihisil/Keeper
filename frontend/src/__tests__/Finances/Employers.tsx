import { getAllByRole, render, screen } from "@testing-library/react";
import Employers from "components/Finances/Employers/Employers";
import React from "react";

// TODO add mocks for tests data
it("renders list of employers", () => {
  render(
    <Employers accounts={[]} dispatchAccounts={() => {}} transactions={[]} dispatchTransactions={() => {}} />
  );
  expect(screen.getByText("Employers")).toBeInTheDocument();

  const table = screen.getByTestId("employers-table");
  const rows = getAllByRole(table, "row");

  expect(rows.length).toEqual(2);
});
