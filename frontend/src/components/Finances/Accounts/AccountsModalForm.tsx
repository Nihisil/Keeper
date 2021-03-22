import { AxiosError } from "axios";
import { Account, AccountType, Currency } from "client/data-contracts";
import DisplayError from "components/App/DisplayError";
import { AccountsAction } from "components/Finances/Accounts/AccountsMethods";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import api from "utils/api";
import { Nullish } from "utils/base";
import { convertMoneyToNumber, convertNumberToMoney } from "utils/finances";

interface AccountsModalFormProps {
  show: boolean;
  onHide(): void;
  afterSubmit(action: AccountsAction): void;
  entity?: Account;
}

export default function AccountsModalForm({
  show,
  onHide,
  afterSubmit,
  entity,
}: AccountsModalFormProps): JSX.Element {
  const [requestInProgress, setRequestInProgress] = useState(false);
  const [formError, setFormError] = useState<Nullish<AxiosError>>(undefined);
  const [accountName, setAccountName] = useState(entity?.name);
  const [accountCurrency, setAccountCurrency] = useState(entity?.currency);
  const [accountType, setAccountType] = useState(entity?.account_type);
  const [accountBalance, setAccountBalance] = useState(entity?.balance);

  // set form defaults when edit entity
  useEffect(() => {
    setAccountName(entity?.name);
    setAccountCurrency(entity?.currency);
    setAccountType(entity?.account_type);
    setAccountBalance(convertMoneyToNumber(entity?.balance as number));
  }, [entity?.name, entity?.currency, entity?.account_type, entity?.balance]);

  const cleanUpForm = () => {
    setAccountName("");
    setAccountCurrency(undefined);
    setAccountType(undefined);
    setAccountBalance(0);
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (requestInProgress) {
      return;
    }

    setRequestInProgress(true);

    const actionType: "create" | "update" = entity?.id ? "update" : "create";
    const account = {
      ...entity,
      ...{
        name: accountName,
        currency: accountCurrency,
        account_type: accountType,
        balance: convertNumberToMoney(accountBalance as number),
      },
    } as Account;
    const action = entity?.id ? api.finance.updateAccount : api.finance.createAccount;

    try {
      const response = await action(account, { secure: true });
      afterSubmit({ type: actionType, account: response.data });

      onHide();
      cleanUpForm();
    } catch (requestError) {
      setFormError(requestError);
    }

    setRequestInProgress(false);
  };

  const currencyOptions = Object.keys(Currency).map((item) => (
    <option key={item} value={item}>
      {item}
    </option>
  ));

  const accountTypeOptions = Object.keys(AccountType).map((item) => (
    <option key={item} value={item}>
      {item}
    </option>
  ));

  return (
    <Modal show={show} onHide={onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Create Account</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleOnSubmit}>
        <Modal.Body>
          <DisplayError error={formError} />
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              value={accountName}
              placeholder="Name"
              onChange={(e) => setAccountName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="balance">
            <Form.Label>Balance</Form.Label>
            <Form.Control
              type="number"
              value={accountBalance}
              placeholder="Balance"
              step=".01"
              onChange={(e) => setAccountBalance((e.target.value as unknown) as number)}
              required
            />
          </Form.Group>
          <Form.Group controlId="currency">
            <Form.Label>Currency</Form.Label>
            <Form.Control
              as="select"
              value={accountCurrency}
              onChange={(e) => setAccountCurrency(e.target.value as Currency)}
              required
            >
              <option disabled selected>
                -- select an option --
              </option>
              {currencyOptions}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="accountType">
            <Form.Label>Account Type</Form.Label>
            <Form.Control
              as="select"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value as AccountType)}
              required
            >
              <option disabled selected>
                -- select an option --
              </option>
              {accountTypeOptions}
            </Form.Control>
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
          <Button type="submit" disabled={requestInProgress}>
            Save
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

AccountsModalForm.defaultProps = {
  entity: undefined,
};
