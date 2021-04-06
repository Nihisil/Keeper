import { Employer, Transaction, TransactionType } from "client/data-contracts";
import ConfirmDeleteModal from "components/App/General/ConfirmDeleteModal";
import { EmployersAction } from "components/Finances/Employers/EmployersMethods";
import EmployersModalForm from "components/Finances/Employers/EmployersModalForm";
import {
  TransactionsAccountsCategoriesProps,
  TransactionsAction,
  TransactionsModalData,
} from "components/Finances/Transactions/TransactionsMethods";
import TransactionsModalForm from "components/Finances/Transactions/TransactionsModalForm";
import React, { useState } from "react";
import { Button, Table } from "react-bootstrap";
import api from "utils/api";
import { getById } from "utils/crud";
import { displayDatetime } from "utils/date";
import { displayMoney } from "utils/finances";

interface EmployersModalData {
  show: boolean;
  entity?: Employer;
}

interface EmployersListProps extends TransactionsAccountsCategoriesProps {
  employers: Array<Employer>;
  dispatchEmployers(action: EmployersAction): void;
}

export default function EmployersList({
  employers,
  dispatchEmployers,
  accounts,
  dispatchAccounts,
  dispatchTransactions,
  financeCategories,
  dispatchFinanceCategories,
}: EmployersListProps): JSX.Element {
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    toDeleteName: "",
    toDeleteId: "",
  });
  const [editModal, setEditModal] = useState({
    show: false,
    entity: undefined,
  } as EmployersModalData);
  const [transactionModal, setTransactionModal] = useState({
    show: false,
    entity: undefined,
  } as TransactionsModalData);

  const deleteEmployer = async (employerId: string) => {
    const employer = getById(employers, employerId);
    await api.finance.deleteEmployer(employer, { secure: true });
    dispatchEmployers({ type: "delete", employer });
  };

  const afterIncomeTransactionCreated = (action: TransactionsAction) => {
    if (action.type !== "create") {
      return;
    }

    // update transactions list
    dispatchTransactions(action);

    const employer = getById(employers, action.transaction.from_employer_id as string);
    if (!employer.earnings) {
      employer.earnings = 0;
    }
    employer.earnings += action.transaction.amount;

    dispatchEmployers({
      type: "update",
      employer,
    });
  };

  const employerRows = employers.map((item) => (
    <tr key={item.id}>
      <td>{item.name}</td>
      <td>{displayMoney(item.earnings as number)}</td>
      <td>{item.earnings_currency ? item.earnings_currency : "-"}</td>
      <td>{displayDatetime(item.updated)}</td>
      <td>
        <Button
          size="sm"
          className="mr-2"
          onClick={() => {
            setEditModal({ show: true, entity: item });
          }}
        >
          Edit
        </Button>
        <Button
          variant="success"
          size="sm"
          className="mr-2"
          onClick={() => {
            setTransactionModal({
              show: true,
              entity: {
                from_employer_id: item.id as string,
                type: TransactionType.INCOME,
              } as Transaction,
            });
          }}
        >
          Add income
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() =>
            setDeleteModal({
              show: true,
              toDeleteName: item.name,
              toDeleteId: item.id as string,
            })
          }
        >
          Delete
        </Button>
      </td>
    </tr>
  ));

  return (
    <>
      <Table responsive bordered striped size="sm" data-testid="employers-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Earnings</th>
            <th>Currency</th>
            <th>Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employers.length ? (
            employerRows
          ) : (
            <tr>
              <td colSpan={5}>No data</td>
            </tr>
          )}
        </tbody>
      </Table>
      <ConfirmDeleteModal
        show={deleteModal.show}
        onHide={() => setDeleteModal({ show: false, toDeleteName: "", toDeleteId: "" })}
        toDeleteName={deleteModal.toDeleteName}
        toDeleteId={deleteModal.toDeleteId}
        deleteAction={deleteEmployer}
      />
      <EmployersModalForm
        show={editModal.show}
        onHide={() => setEditModal({ show: false, entity: undefined })}
        afterSubmit={dispatchEmployers}
        entity={editModal.entity}
      />
      <TransactionsModalForm
        show={transactionModal.show}
        onHide={() => setTransactionModal({ show: false, entity: undefined })}
        afterSubmit={(action) => {
          afterIncomeTransactionCreated(action);
        }}
        entity={transactionModal.entity}
        accounts={accounts}
        dispatchAccounts={dispatchAccounts}
        financeCategories={financeCategories}
        dispatchFinanceCategories={dispatchFinanceCategories}
      />
    </>
  );
}
