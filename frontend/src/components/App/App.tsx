import React from "react";
import { Switch, Route } from "react-router-dom";
import "components/App/App.scss";
import Finances from "components/Finances/Finances";
import Login from "components/Login/Login";
import api, { fetchData } from "utils/api";
import Header from "components/App/Header";
import Home from "components/App/Home";

const resource = fetchData(api.users.getAuthUserInfo);

export default function App(): JSX.Element {
  const user = resource.read();
  if (!user) {
    return <Login />;
  }

  return (
    <>
      <Header user={user} />
      <main role="main" className="container">
        <Switch>
          <Route path="/finances">
            <Finances />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </main>
    </>
  );
}
