import "components/Finances/CurrencyExchangeRates/CurrencyExchangeRates.scss";

import { Currency, CurrencyExchangeRate } from "client/data-contracts";
import React, { useEffect, useState } from "react";
import { Badge, Table } from "react-bootstrap";
import api from "utils/api";
import { Nullish } from "utils/base";
import { displayDate } from "utils/date";

interface CurrencyExchangeRatesProp {}

// TODO load these constants from server side
const DEFAULT_CURRENCY = Currency.RUB;
const CURRENCY_PAIRS = Object.keys(Currency).filter((item) => item !== DEFAULT_CURRENCY);

export default function CurrencyExchangeRates({}: CurrencyExchangeRatesProp): JSX.Element {
  const [rates, setRates] = useState<CurrencyExchangeRate[]>([]);
  const [selectedPair, setSelectedPair] = useState(CURRENCY_PAIRS[0]);
  const page = 1;

  useEffect(() => {
    (async () => {
      const response = await api.finance.getListOfCurrencyExchangeRatesForSpecifiedPair(
        {
          from_currency: DEFAULT_CURRENCY,
          to_currency: selectedPair as Currency,
          page,
        },
        { secure: true }
      );
      setRates(response.data.items);
    })();
  }, [selectedPair]);

  const formatDelta = (currentItem: CurrencyExchangeRate, previousItem: CurrencyExchangeRate) => {
    const delta = currentItem.rate - previousItem.rate;
    let deltaString = delta.toFixed(2);
    if (delta > 0) {
      deltaString = `+${deltaString}`;
    }
    return (
      <Badge className="currency-delta" variant={delta > 0 ? "success" : "danger"}>
        {deltaString}
      </Badge>
    );
  };

  let previousItem: Nullish<CurrencyExchangeRate>;
  const rows = rates.map((item, index) => {
    previousItem = rates[index + 1];
    return (
      <tr key={item.id}>
        <td>{displayDate(item.date)}</td>
        <td>{item.rate.toFixed(4)}</td>
        <td>{previousItem ? formatDelta(item, previousItem) : "-"}</td>
      </tr>
    );
  });

  const currencyOptions = CURRENCY_PAIRS.map((item) => (
    <Badge
      key={item}
      variant={item === selectedPair ? "success" : "primary"}
      className="mr-2"
      role="button"
      onClick={() => setSelectedPair(item)}
    >
      {DEFAULT_CURRENCY} - {item}
    </Badge>
  ));

  return (
    <>
      <h3>Currency Exchange Rates</h3>

      {currencyOptions}

      <Table
        responsive
        bordered
        striped
        size="sm"
        data-testid="currency-exchange-rates-table"
        className="mt-2"
      >
        <thead>
          <tr>
            <th>Date</th>
            <th>Rate</th>
            <th>Delta</th>
          </tr>
        </thead>
        <tbody>
          {rates.length ? (
            rows
          ) : (
            <tr>
              <td colSpan={3}>No data</td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );
}
