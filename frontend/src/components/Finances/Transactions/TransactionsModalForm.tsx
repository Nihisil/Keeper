import { AxiosError } from "axios";
import { Transaction, TransactionType } from "client/data-contracts";
import DisplayError from "components/App/DisplayError";
import { AccountsProps } from "components/Finances/Accounts/AccountsMethods";
import { FinanceCategoriesProps } from "components/Finances/FinanceCategories/FinanceCategoriesMethods";
import { TransactionsAction } from "components/Finances/Transactions/TransactionsMethods";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import api from "utils/api";
import { Nullish } from "utils/base";
import { getById, updateCategoryAmountFromTransaction } from "utils/crud";
import { DATE_INPUT_FORMAT, displayDate } from "utils/date";
import dayjs from "utils/dayjs";
import { convertMoneyToNumber, convertNumberToMoney } from "utils/finances";

interface TransactionsModalFormProps extends AccountsProps, FinanceCategoriesProps {
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
  financeCategories,
  dispatchFinanceCategories,
}: TransactionsModalFormProps): JSX.Element {
  const [requestInProgress, setRequestInProgress] = useState(false);
  const [formError, setFormError] = useState<Nullish<AxiosError>>(undefined);
  const [transactionAmount, setTransactionAmount] = useState(entity?.amount);
  const [transactionDate, setTransactionDate] = useState<string>(dayjs().format(DATE_INPUT_FORMAT));
  const [accountId, setAccountId] = useState(entity?.account_id);
  const [categoryId, setCategoryId] = useState(entity?.category_id);
  const [transactionType, setTransactionType] = useState<TransactionType>(TransactionType.REGULAR);

  // set form defaults when edit entity
  useEffect(() => {
    setTransactionAmount(convertMoneyToNumber(entity?.amount as number));
    setTransactionDate(displayDate(entity?.date));
    setAccountId(entity?.account_id);
    setCategoryId(entity?.category_id);
    setTransactionType(entity?.type || TransactionType.REGULAR);
  }, [entity?.amount, entity?.date, entity?.account_id, entity?.type, entity?.category_id]);

  const cleanUpForm = () => {
    setTransactionAmount(undefined);
    setTransactionDate(dayjs().format(DATE_INPUT_FORMAT));
    setAccountId(undefined);
    setCategoryId(undefined);
    setTransactionType(TransactionType.REGULAR);
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (requestInProgress) {
      return;
    }

    setRequestInProgress(true);

    const account = getById(accounts, accountId as string);
    const actionType: "create" | "update" = entity?.id ? "update" : "create";
    const originalTransaction = {
      ...entity,
      ...{
        amount: convertNumberToMoney(transactionAmount as number),
        date: dayjs(transactionDate).toISOString(),
        account_id: accountId,
        category_id: categoryId,
        currency: account.currency,
        type: transactionType,
      },
    } as Transaction;
    const action = entity?.id ? api.finance.updateTransaction : api.finance.createTransaction;

    try {
      const response = await action(originalTransaction, { secure: true });
      const updatedTransaction = response.data;

      afterSubmit({ type: actionType, transaction: updatedTransaction });
      if (updatedTransaction.account) {
        dispatchAccounts({ type: "update", account: updatedTransaction.account });
      }

      if (categoryId) {
        let category = getById(financeCategories, categoryId as string);

        // when we edit transaction, we need to smartly update category balance
        if (entity?.amount && category.amount) {
          if (entity?.main_currency_exchange_rate) {
            category.amount -= entity?.main_currency_exchange_rate * entity?.amount;
          } else {
            category.amount -= entity?.amount;
          }
        }

        category = updateCategoryAmountFromTransaction(category, updatedTransaction, true);
        dispatchFinanceCategories({
          type: "update",
          financeCategory: category,
        });
      }

      onHide();
      cleanUpForm();
    } catch (requestError) {
      setFormError(requestError);
    }

    setRequestInProgress(false);
  };

  const accountOptions = accounts.map((item) => (
    <option key={item.id} value={item.id}>
      {item.name}
    </option>
  ));

  const categoriesOptions = financeCategories.map((item) => (
    <option key={item.id} value={item.id}>
      {item.name}
    </option>
  ));

  const typesOptions = Object.keys(TransactionType).map((item) => (
    <option key={item} value={item}>
      {item}
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
          <Form.Group controlId="type">
            <Form.Label>Type</Form.Label>
            <Form.Control
              as="select"
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value as TransactionType)}
              required
            >
              <option disabled selected>
                -- select an option --
              </option>
              {typesOptions}
            </Form.Control>
          </Form.Group>
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
          <Form.Group controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              as="select"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value as string)}
            >
              <option disabled selected>
                -- select an option --
              </option>
              {categoriesOptions}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="amount">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              value={transactionAmount}
              placeholder="Amount"
              step=".01"
              min="0"
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
          <Button type="submit" disabled={requestInProgress}>
            Save
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

TransactionsModalForm.defaultProps = {
  entity: undefined,
};
