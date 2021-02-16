import React, { useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "components/App/App.scss";
import Finances from "components/Finances/Finances";
import Preferences from "components/Preferences/Preferences";
import Login from "components/Login/Login";
import { Token } from "client/data-contracts";

export default function App(): JSX.Element {
  const [token, setToken] = useState<Token>();
  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <div className="wrapper">
      <h1>Application</h1>
      <BrowserRouter>
        <Switch>
          <Route path="/finances">
            <Finances />
          </Route>
          <Route path="/preferences">
            <Preferences />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}
