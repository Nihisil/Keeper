import { Account } from "client/data-contracts";
import { AccountAction } from "components/Finances/Accounts/Accounts";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import api from "utils/api";

interface AccountsModalFormProps {
  show: boolean;
  onHide(): void;
  afterSubmit(action: AccountAction): void;
  entity?: Account;
}

export type ModalData = {
  show: boolean;
  entity?: Account;
};

export default function AccountsModalForm({
  show,
  onHide,
  afterSubmit,
  entity,
}: AccountsModalFormProps): JSX.Element {
  const [accountName, setAccountName] = useState(entity?.name);

  useEffect(() => {
    setAccountName(entity?.name);
  }, [entity?.name]);

  const cleanUpForm = () => {
    setAccountName("");
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let actionType: "create" | "update";
    let account: Account;
    if (entity) {
      actionType = "update";
      account = entity;
      account.name = accountName as string;
    } else {
      actionType = "create";
      account = { name: accountName } as Account;
    }
    const action = actionType === "create" ? api.finance.createAccount : api.finance.updateAccount;

    const response = await action(account, { secure: true });
    afterSubmit({ type: actionType, account: response.data });
    onHide();

    if (!entity) {
      cleanUpForm();
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Create Account</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleOnSubmit}>
        <Modal.Body>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Account name</Form.Label>
            <Form.Control
              type="name"
              value={accountName}
              placeholder="Account name"
              onChange={(e) => setAccountName(e.target.value)}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              onHide();
            }}
            variant="secondary"
          >
            Close
          </Button>
          <Button type="submit">Save</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

AccountsModalForm.defaultProps = {
  entity: undefined,
};
