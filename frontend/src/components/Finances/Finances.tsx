import Employers from "components/Finances/Employers/Employers";
import React from "react";

export default function Finances(): JSX.Element {
  return (
    <>
      <div className="row">
        <div className="col">
          <h2>Finances</h2>
          <hr />
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
