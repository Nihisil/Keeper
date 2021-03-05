import { Account } from "client/data-contracts";
import ConfirmDeleteModal from "components/App/utils/ConfirmDeleteModal";
import { AccountAction } from "components/Finances/Accounts/Accounts";
import AccountsModalForm, { ModalData } from "components/Finances/Accounts/AccountsModalForm";
import React, { useState } from "react";
import { Button, Table } from "react-bootstrap";
import api from "utils/api";
import displayDate from "utils/date";

interface AccountsListProps {
  accounts: Array<Account>;
  dispatchAccounts(action: AccountAction): void;
}

export default function AccountsList({ accounts, dispatchAccounts }: AccountsListProps): JSX.Element {
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    toDeleteName: "",
    toDeleteId: "",
  });
  const [editModal, setEditModal] = useState({
    show: false,
    entity: undefined,
  } as ModalData);

  const deleteAccount = async (accountId: string) => {
    const account = accounts.find((item) => item.id === accountId);
    if (!account) {
      throw Error("Not correct account id was passed to delete function");
    }
    await api.finance.deleteAccount(account, { secure: true });
    dispatchAccounts({ type: "delete", account });
  };

  const accountRows = accounts.map((item) => (
    <tr key={item.id}>
      <td>{item.name}</td>
      <td>{displayDate(item.updated)}</td>
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
      <Table responsive bordered striped size="sm" data-testid="accounts-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.length ? (
            accountRows
          ) : (
            <tr>
              <td colSpan={3}>No data</td>
            </tr>
          )}
        </tbody>
      </Table>
      <ConfirmDeleteModal
        show={deleteModal.show}
        onHide={() => setDeleteModal({ show: false, toDeleteName: "", toDeleteId: "" })}
        toDeleteName={deleteModal.toDeleteName}
        toDeleteId={deleteModal.toDeleteId}
        deleteAction={deleteAccount}
      />
      <AccountsModalForm
        show={editModal.show}
        onHide={() => setEditModal({ show: false, entity: undefined })}
        afterSubmit={dispatchAccounts}
        entity={editModal.entity}
      />
    </>
  );
}
