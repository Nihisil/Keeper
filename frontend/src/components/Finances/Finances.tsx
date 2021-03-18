import Accounts from "components/Finances/Accounts/Accounts";
import { accountsReducer } from "components/Finances/Accounts/AccountsHelpers";
import Employers from "components/Finances/Employers/Employers";
import Transactions from "components/Finances/Transactions/Transactions";
import React, { useReducer } from "react";
import { Link } from "react-router-dom";

export default function Finances(): JSX.Element {
  const [accounts, dispatchAccounts] = useReducer(accountsReducer, []);

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
          <Transactions accounts={accounts} dispatchAccounts={dispatchAccounts} />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <Accounts accounts={accounts} dispatchAccounts={dispatchAccounts} />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <Employers accounts={accounts} dispatchAccounts={dispatchAccounts} />
        </div>
      </div>
    </>
  );
}
