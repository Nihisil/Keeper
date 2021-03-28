import TransactionsList from "components/Finances/Transactions/TransactionsList";
import { TransactionsAccountsCategoriesProps } from "components/Finances/Transactions/TransactionsMethods";
import TransactionsModalForm from "components/Finances/Transactions/TransactionsModalForm";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import api from "utils/api";

export default function Transactions({
  accounts,
  dispatchAccounts,
  transactions,
  dispatchTransactions,
  financeCategories,
  dispatchFinanceCategories,
}: TransactionsAccountsCategoriesProps): JSX.Element {
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await api.finance.getListOfTransactions({ secure: true });
      dispatchTransactions({ type: "load", transactions: response.data });
    })();
  }, [dispatchTransactions]);

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
        financeCategories={financeCategories}
        dispatchFinanceCategories={dispatchFinanceCategories}
      />
      <TransactionsModalForm
        show={modalShow}
        onHide={() => setModalShow(false)}
        afterSubmit={dispatchTransactions}
        entity={undefined}
        accounts={accounts}
        dispatchAccounts={dispatchAccounts}
        financeCategories={financeCategories}
        dispatchFinanceCategories={dispatchFinanceCategories}
      />
    </>
  );
}
