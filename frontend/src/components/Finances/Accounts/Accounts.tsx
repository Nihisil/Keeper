import { AccountsProps } from "components/Finances/Accounts/AccountsHelpers";
import AccountsList from "components/Finances/Accounts/AccountsList";
import AccountsModalForm from "components/Finances/Accounts/AccountsModalForm";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import api from "utils/api";

export default function Accounts({ accounts, dispatchAccounts }: AccountsProps): JSX.Element {
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await api.finance.getListOfAccounts({ secure: true });
      dispatchAccounts({ type: "load", accounts: response.data });
    })();
  }, [dispatchAccounts]);

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
