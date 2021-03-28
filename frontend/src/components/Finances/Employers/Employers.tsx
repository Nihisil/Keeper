import EmployersList from "components/Finances/Employers/EmployersList";
import { employersReducer } from "components/Finances/Employers/EmployersMethods";
import EmployersModalForm from "components/Finances/Employers/EmployersModalForm";
import { TransactionsAccountsCategoriesProps } from "components/Finances/Transactions/TransactionsMethods";
import React, { useEffect, useReducer, useState } from "react";
import { Button } from "react-bootstrap";
import api from "utils/api";

export default function Employers({
  accounts,
  dispatchAccounts,
  transactions,
  dispatchTransactions,
  financeCategories,
  dispatchFinanceCategories,
}: TransactionsAccountsCategoriesProps): JSX.Element {
  const [modalShow, setModalShow] = useState(false);
  const [employers, dispatchEmployers] = useReducer(employersReducer, []);

  useEffect(() => {
    (async () => {
      const response = await api.finance.getListOfEmployers({ secure: true });
      dispatchEmployers({ type: "load", employers: response.data });
    })();
  }, []);

  return (
    <>
      <h3>
        Employers
        <Button variant="success" className="ml-4" size="sm" onClick={() => setModalShow(true)}>
          Create
        </Button>
      </h3>
      <EmployersList
        employers={employers}
        dispatchEmployers={dispatchEmployers}
        accounts={accounts}
        dispatchAccounts={dispatchAccounts}
        transactions={transactions}
        dispatchTransactions={dispatchTransactions}
        financeCategories={financeCategories}
        dispatchFinanceCategories={dispatchFinanceCategories}
      />
      <EmployersModalForm
        show={modalShow}
        onHide={() => setModalShow(false)}
        afterSubmit={dispatchEmployers}
        entity={undefined}
      />
    </>
  );
}
