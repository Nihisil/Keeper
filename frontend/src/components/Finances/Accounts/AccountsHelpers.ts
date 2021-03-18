import { Account } from "client/data-contracts";

export interface AccountsProps {
  accounts: Array<Account>;
  dispatchAccounts(action: AccountAction): void;
}

export function accountsReducer(accounts: Account[], action: AccountAction): Account[] {
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

export type AccountAction =
  | { type: "load"; accounts: Account[] }
  | { type: "create"; account: Account }
  | { type: "update"; account: Account }
  | { type: "delete"; account: Account };
