import ConfirmDeleteModal from "components/App/General/ConfirmDeleteModal";
import {
  TransactionsAccountsCategoriesProps,
  TransactionsModalData,
} from "components/Finances/Transactions/TransactionsMethods";
import TransactionsModalForm from "components/Finances/Transactions/TransactionsModalForm";
import React, { useState } from "react";
import { Button, Table } from "react-bootstrap";
import api from "utils/api";
import { displayDatetime } from "utils/date";
import { displayMoney } from "utils/finances";

export default function TransactionsList({
  transactions,
  dispatchTransactions,
  accounts,
  dispatchAccounts,
  financeCategories,
  dispatchFinanceCategories,
}: TransactionsAccountsCategoriesProps): JSX.Element {
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
    const response = await api.finance.deleteTransaction(transaction, { secure: true });
    dispatchTransactions({ type: "delete", transaction });
    dispatchAccounts({ type: "update", account: response.data });
  };

  const transactionRows = transactions.map((item) => (
    <tr key={item.id}>
      <td>{item.account?.name}</td>
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
              toDeleteName: `${displayMoney(item.amount as number)} ${item.currency}`,
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
            <th>Account</th>
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
              <td colSpan={6}>No data</td>
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
        financeCategories={financeCategories}
        dispatchFinanceCategories={dispatchFinanceCategories}
      />
    </>
  );
}
