import { Employer, Transaction, TransactionType } from "client/data-contracts";
import ConfirmDeleteModal from "components/App/utils/ConfirmDeleteModal";
import { AccountsProps } from "components/Finances/Accounts/AccountsHelpers";
import { EmployersAction } from "components/Finances/Employers/Employers";
import EmployersModalForm from "components/Finances/Employers/EmployersModalForm";
import { TransactionsModalData } from "components/Finances/Transactions/TransactionsList";
import TransactionsModalForm from "components/Finances/Transactions/TransactionsModalForm";
import React, { useState } from "react";
import { Button, Table } from "react-bootstrap";
import api from "utils/api";
import { displayDatetime } from "utils/date";

interface EmployersListProps extends AccountsProps {
  employers: Array<Employer>;
  dispatchEmployers(action: EmployersAction): void;
}

interface EmployersModalData {
  show: boolean;
  entity?: Employer;
}

export default function EmployersList({
  employers,
  dispatchEmployers,
  accounts,
  dispatchAccounts,
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
    const employer = employers.find((item) => item.id === employerId);
    if (!employer) {
      throw Error("Not correct employer id was passed to delete function");
    }
    await api.finance.deleteEmployer(employer, { secure: true });
    dispatchEmployers({ type: "delete", employer });
  };

  const employerRows = employers.map((item) => (
    <tr key={item.id}>
      <td>{item.name}</td>
      <td>-</td>
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
            <th>Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employers.length ? (
            employerRows
          ) : (
            <tr>
              <td colSpan={4}>No data</td>
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
        afterSubmit={() => {}}
        entity={transactionModal.entity}
        accounts={accounts}
        dispatchAccounts={dispatchAccounts}
      />
    </>
  );
}
