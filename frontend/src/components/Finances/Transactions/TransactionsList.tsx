import { Transaction } from "client/data-contracts";
import ConfirmDeleteModal from "components/App/utils/ConfirmDeleteModal";
import { AccountsProps } from "components/Finances/Accounts/AccountsHelpers";
import { TransactionsAction } from "components/Finances/Transactions/Transactions";
import TransactionsModalForm from "components/Finances/Transactions/TransactionsModalForm";
import React, { useState } from "react";
import { Button, Table } from "react-bootstrap";
import api from "utils/api";
import { displayDatetime } from "utils/date";
import { displayMoney } from "utils/finances";

interface TransactionsListProps extends AccountsProps {
  transactions: Array<Transaction>;
  dispatchTransactions(action: TransactionsAction): void;
}

export type TransactionsModalData = {
  show: boolean;
  entity?: Transaction;
};

export default function TransactionsList({
  transactions,
  dispatchTransactions,
  accounts,
  dispatchAccounts,
}: TransactionsListProps): JSX.Element {
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    toDeleteName: "",
    toDeleteId: "",
  });
  const [editModal, setEditModal] = useState({
    show: false,
    entity: undefined,
  } as TransactionsModalData);

  const deleteTransaction = async (transactionId: string) => {
    const transaction = transactions.find((item) => item.id === transactionId);
    if (!transaction) {
      throw Error("Not correct transaction id was passed to delete function");
    }
    await api.finance.deleteTransaction(transaction, { secure: true });
    dispatchTransactions({ type: "delete", transaction });
  };

  const transactionRows = transactions.map((item) => (
    <tr key={item.id}>
      <td>{displayMoney(item.amount as number)}</td>
      <td>{item.currency}</td>
      <td>{item.type}</td>
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
          variant="danger"
          size="sm"
          onClick={() =>
            setDeleteModal({
              show: true,
              toDeleteName: item.id as string,
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
      <Table responsive bordered striped size="sm" data-testid="transactions-table">
        <thead>
          <tr>
            <th>Amount</th>
            <th>Currency</th>
            <th>Type</th>
            <th>Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length ? (
            transactionRows
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
        deleteAction={deleteTransaction}
      />
      <TransactionsModalForm
        show={editModal.show}
        onHide={() => setEditModal({ show: false, entity: undefined })}
        afterSubmit={dispatchTransactions}
        entity={editModal.entity}
        accounts={accounts}
        dispatchAccounts={dispatchAccounts}
      />
    </>
  );
}