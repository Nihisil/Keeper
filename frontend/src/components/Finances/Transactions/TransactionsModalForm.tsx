import { AxiosError } from "axios";
import { Transaction } from "client/data-contracts";
import DisplayError from "components/App/DisplayError";
import { AccountsProps } from "components/Finances/Accounts/AccountsHelpers";
import { TransactionsAction } from "components/Finances/Transactions/Transactions";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import api from "utils/api";
import { Nullish } from "utils/base";
import dayjs from "utils/dayjs";
import { convertNumberToMoney } from "utils/finances";

interface TransactionsModalFormProps extends AccountsProps {
  show: boolean;
  onHide(): void;
  afterSubmit(action: TransactionsAction): void;
  entity?: Transaction;
}

export default function TransactionsModalForm({
  show,
  onHide,
  afterSubmit,
  entity,
  accounts,
  dispatchAccounts,
}: TransactionsModalFormProps): JSX.Element {
  const date = entity?.date || dayjs().format("YYYY-MM-DD");
  const [formError, setFormError] = useState<Nullish<AxiosError>>(undefined);
  const [transactionAmount, setTransactionAmount] = useState(entity?.amount);
  const [transactionDate, setTransactionDate] = useState(date);
  const [accountId, setAccountId] = useState(entity?.account_id);

  // set form defaults when edit entity
  useEffect(() => {
    setTransactionAmount(entity?.amount);
  }, [entity]);

  const cleanUpForm = () => {
    setTransactionAmount(undefined);
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const account = accounts.find((item) => item.id === accountId);
    if (!account) {
      return;
    }

    const actionType: "create" | "update" = entity?.id ? "update" : "create";
    const transaction = {
      ...entity,
      ...{
        amount: convertNumberToMoney(transactionAmount as number),
        date: dayjs(transactionDate).toISOString(),
        account_id: accountId,
        currency: account.currency,
      },
    } as Transaction;
    const action = entity?.id ? api.finance.updateTransaction : api.finance.createTransaction;

    try {
      const response = await action(transaction, { secure: true });

      afterSubmit({ type: actionType, transaction: response.data.transaction });
      dispatchAccounts({ type: "update", account: response.data.account });

      onHide();
      cleanUpForm();
    } catch (requestError) {
      setFormError(requestError);
    }
  };

  const accountOptions = accounts.map((item) => (
    <option key={item.id} value={item.id}>
      {item.name}
    </option>
  ));

  return (
    <Modal show={show} onHide={onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Create Transaction</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleOnSubmit}>
        <Modal.Body>
          <DisplayError error={formError} />
          <Form.Group controlId="account">
            <Form.Label>Account</Form.Label>
            <Form.Control
              as="select"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value as string)}
              required
            >
              <option disabled selected>
                -- select an option --
              </option>
              {accountOptions}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="amount">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              value={transactionAmount}
              placeholder="Amount"
              step=".01"
              onChange={(e) => setTransactionAmount((e.target.value as unknown) as number)}
              required
            />
          </Form.Group>
          <Form.Group controlId="date">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              value={transactionDate}
              placeholder="Date"
              onChange={(e) => setTransactionDate((e.target.value as unknown) as string)}
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

TransactionsModalForm.defaultProps = {
  entity: undefined,
};
