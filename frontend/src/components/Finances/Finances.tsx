import Accounts from "components/Finances/Accounts/Accounts";
import { accountsReducer } from "components/Finances/Accounts/AccountsMethods";
import Employers from "components/Finances/Employers/Employers";
import Transactions from "components/Finances/Transactions/Transactions";
import { transactionsReducer } from "components/Finances/Transactions/TransactionsMethods";
import React, { useReducer } from "react";
import { Link } from "react-router-dom";

export default function Finances(): JSX.Element {
  const [accounts, dispatchAccounts] = useReducer(accountsReducer, []);
  const [transactions, dispatchTransactions] = useReducer(transactionsReducer, []);

  return (
    <>
      <div className="row">
        <div className="col">
          <h2>Finances</h2>
          <Link className="small" to="/finances/currency-exchange-rates">
            [Currency exchange rates]
          </Link>
          <hr />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <Transactions
            transactions={transactions}
            dispatchTransactions={dispatchTransactions}
            accounts={accounts}
            dispatchAccounts={dispatchAccounts}
          />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <Accounts accounts={accounts} dispatchAccounts={dispatchAccounts} />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <Employers
            transactions={transactions}
            dispatchTransactions={dispatchTransactions}
            accounts={accounts}
            dispatchAccounts={dispatchAccounts}
          />
        </div>
      </div>
    </>
  );
}
