import { Transaction } from "client/data-contracts";
import { AccountsProps } from "components/Finances/Accounts/AccountsHelpers";
import TransactionsList from "components/Finances/Transactions/TransactionsList";
import TransactionsModalForm from "components/Finances/Transactions/TransactionsModalForm";
import React, { useEffect, useReducer, useState } from "react";
import { Button } from "react-bootstrap";
import api from "utils/api";

export type TransactionAction =
  | { type: "load"; transactions: Transaction[] }
  | { type: "create"; transaction: Transaction }
  | { type: "update"; transaction: Transaction }
  | { type: "delete"; transaction: Transaction };

function reducer(transactions: Transaction[], action: TransactionAction): Transaction[] {
  switch (action.type) {
    case "load":
      return action.transactions;
    case "create":
      return [action.transaction, ...transactions];
    case "update":
      return transactions
        .map((item) => (item.id === action.transaction.id ? action.transaction : item))
        .sort((a, b) => ((a.updated || 0) > (b.updated || 0) ? -1 : 1));
    case "delete":
      return transactions.filter((item) => item.id !== action.transaction.id);
    default:
      throw Error("Unknown transactions reducer action.");
  }
}

export default function Transactions({ accounts, dispatchAccounts }: AccountsProps): JSX.Element {
  const [modalShow, setModalShow] = useState(false);
  const [transactions, dispatchTransactions] = useReducer(reducer, []);

  useEffect(() => {
    (async () => {
      const response = await api.finance.getListOfTransactions({ secure: true });
      dispatchTransactions({ type: "load", transactions: response.data });
    })();
  }, []);

  return (
    <>
      <h3>
        Transactions
        <Button variant="success" className="ml-4" size="sm" onClick={() => setModalShow(true)}>
          Create
        </Button>
      </h3>
      <TransactionsList
        transactions={transactions}
        dispatchTransactions={dispatchTransactions}
        accounts={accounts}
        dispatchAccounts={dispatchAccounts}
      />
      <TransactionsModalForm
        show={modalShow}
        onHide={() => setModalShow(false)}
        afterSubmit={dispatchTransactions}
        entity={undefined}
        accounts={accounts}
        dispatchAccounts={dispatchAccounts}
      />
    </>
  );
}
