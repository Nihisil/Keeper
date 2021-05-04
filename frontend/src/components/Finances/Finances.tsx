import Accounts from "components/Finances/Accounts/Accounts";
import { accountsReducer } from "components/Finances/Accounts/AccountsMethods";
import FinanceCategories from "components/Finances/FinanceCategories/FinanceCategories";
import { financeCategoriesReducer } from "components/Finances/FinanceCategories/FinanceCategoriesMethods";
import Transactions from "components/Finances/Transactions/Transactions";
import { transactionsReducer } from "components/Finances/Transactions/TransactionsMethods";
import React, { Suspense, useReducer } from "react";
import { Nav } from "react-bootstrap";
import { Link, Route, Switch, useLocation, useRouteMatch } from "react-router-dom";

const Employers = React.lazy(() => import("components/Finances/Employers/Employers"));
const CurrencyExchangeRates = React.lazy(
  () => import("components/Finances/CurrencyExchangeRates/CurrencyExchangeRates")
);

export default function Finances(): JSX.Element {
  const { path, url } = useRouteMatch();
  const location = useLocation();

  const [accounts, dispatchAccounts] = useReducer(accountsReducer, []);
  const [transactions, dispatchTransactions] = useReducer(transactionsReducer, []);
  const [financeCategories, dispatchFinanceCategories] = useReducer(financeCategoriesReducer, []);

  return (
    <>
      <div className="row mb-3">
        <div className="col">
          <h2>Finances</h2>
          <Nav variant="pills" defaultActiveKey={url} activeKey={location.pathname}>
            <Nav.Item>
              <Nav.Link as={Link} to={url} href={url}>
                Main
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                as={Link}
                to={`${url}/currency-exchange-rates`}
                href={`${url}/currency-exchange-rates`}
              >
                Currency exchange rates
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to={`${url}/employers`} href={`${url}/employers`}>
                Employers
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>
      </div>
      <Switch>
        <Route exact path={path}>
          <div className="row">
            <div className="col">
              <Transactions
                transactions={transactions}
                dispatchTransactions={dispatchTransactions}
                accounts={accounts}
                dispatchAccounts={dispatchAccounts}
                financeCategories={financeCategories}
                dispatchFinanceCategories={dispatchFinanceCategories}
              />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <FinanceCategories
                financeCategories={financeCategories}
                dispatchFinanceCategories={dispatchFinanceCategories}
              />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <Accounts accounts={accounts} dispatchAccounts={dispatchAccounts} />
            </div>
          </div>
        </Route>
        <Route exact path={`${path}/currency-exchange-rates`}>
          <Suspense fallback={<p>Loading...</p>}>
            <CurrencyExchangeRates />
          </Suspense>
        </Route>
        <Route exact path={`${path}/employers`}>
          <Suspense fallback={<p>Loading...</p>}>
            <Employers
              transactions={transactions}
              dispatchTransactions={dispatchTransactions}
              accounts={accounts}
              dispatchAccounts={dispatchAccounts}
              financeCategories={financeCategories}
              dispatchFinanceCategories={dispatchFinanceCategories}
            />
          </Suspense>
        </Route>
      </Switch>
    </>
  );
}
