import Accounts from "components/Finances/Accounts/Accounts";
import Employers from "components/Finances/Employers/Employers";
import React from "react";
import { Link } from "react-router-dom";

export default function Finances(): JSX.Element {
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
          <Accounts />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <Employers />
        </div>
      </div>
    </>
  );
}
