import { Transaction } from "client/data-contracts";
import { AccountsProps } from "components/Finances/Accounts/AccountsMethods";

export interface TransactionsAndAccountsProps extends AccountsProps, TransactionsProps {}

export interface TransactionsProps {
  transactions: Array<Transaction>;
  dispatchTransactions(action: TransactionsAction): void;
}

export type TransactionsModalData = {
  show: boolean;
  entity?: Transaction;
};

export type TransactionsAction =
  | { type: "load"; transactions: Transaction[] }
  | { type: "create"; transaction: Transaction }
  | { type: "update"; transaction: Transaction }
  | { type: "delete"; transaction: Transaction };

export function transactionsReducer(transactions: Transaction[], action: TransactionsAction): Transaction[] {
  switch (action.type) {
    case "load":
      return action.transactions;
    case "create":
      return [action.transaction, ...transactions];
    case "update":
      return transactions
        .map((item) => (item.id === action.transaction.id ? action.transaction : item))
        .sort((a, b) => ((a.updated || 0) > (b.updated || 0) ? -1 : 1));
    case "delete":
      return transactions.filter((item) => item.id !== action.transaction.id);
    default:
      throw Error("Unknown transactions transactionsReducer action.");
  }
}
