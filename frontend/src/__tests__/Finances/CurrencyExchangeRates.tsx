import { getAllByRole, render, screen } from "@testing-library/react";
import CurrencyExchangeRates from "components/Finances/CurrencyExchangeRates/CurrencyExchangeRates";
import React from "react";

// TODO add mocks for tests data
it("renders list of currency exchange rates", () => {
  render(<CurrencyExchangeRates />);
  expect(screen.getByText("Currency Exchange Rates")).toBeInTheDocument();

  const table = screen.getByTestId("currency-exchange-rates-table");
  const rows = getAllByRole(table, "row");

  expect(rows.length).toEqual(2);
});
