import { getAllByRole, render, screen } from "@testing-library/react";
import Transactions from "components/Finances/Transactions/Transactions";
import React from "react";

// TODO add mocks for tests data
it("renders list of transactions", () => {
  render(
    <Transactions
      transactions={[]}
      dispatchTransactions={() => {}}
      accounts={[]}
      dispatchAccounts={() => {}}
    />
  );
  expect(screen.getByText("Transactions")).toBeInTheDocument();

  const table = screen.getByTestId("transactions-table");
  const rows = getAllByRole(table, "row");

  expect(rows.length).toEqual(2);
});
