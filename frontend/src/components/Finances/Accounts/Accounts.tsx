import { Account } from "client/data-contracts";
import AccountsList from "components/Finances/Accounts/AccountsList";
import AccountsModalForm from "components/Finances/Accounts/AccountsModalForm";
import React, { useEffect, useReducer, useState } from "react";
import { Button } from "react-bootstrap";
import api from "utils/api";

export type AccountAction =
  | { type: "load"; accounts: Account[] }
  | { type: "create"; account: Account }
  | { type: "update"; account: Account }
  | { type: "delete"; account: Account };

function reducer(accounts: Account[], action: AccountAction): Account[] {
  switch (action.type) {
    case "load":
      return action.accounts;
    case "create":
      return [action.account, ...accounts];
    case "update":
      return accounts
        .map((item) => (item.id === action.account.id ? action.account : item))
        .sort((a, b) => ((a.updated || 0) > (b.updated || 0) ? -1 : 1));
    case "delete":
      return accounts.filter((item) => item.id !== action.account.id);
    default:
      throw Error("Unknown accounts reducer action.");
  }
}

export default function Accounts(): JSX.Element {
  const [modalShow, setModalShow] = useState(false);
  const [accounts, dispatchAccounts] = useReducer(reducer, []);

  useEffect(() => {
    (async () => {
      const response = await api.finance.getListOfAccounts({ secure: true });
      dispatchAccounts({ type: "load", accounts: response.data });
    })();
  }, []);

  return (
    <>
      <h3>
        Accounts
        <Button variant="success" className="ml-4" size="sm" onClick={() => setModalShow(true)}>
          Create
        </Button>
      </h3>
      <AccountsList accounts={accounts} dispatchAccounts={dispatchAccounts} />
      <AccountsModalForm
        show={modalShow}
        onHide={() => setModalShow(false)}
        afterSubmit={dispatchAccounts}
        entity={undefined}
      />
    </>
  );
}
