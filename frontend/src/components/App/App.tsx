import React, { Suspense } from "react";
import { Switch, Route } from "react-router-dom";
import "components/App/App.scss";
import Finances from "components/Finances/Finances";
import Login from "components/Login/Login";
import Header from "components/App/Header";
import Home from "components/App/Home";
import { getToken } from "utils/token";

export default function App(): JSX.Element {
  const token = getToken();
  if (!token) {
    return <Login />;
  }

  return (
    <>
      <Suspense fallback={<p className="general-loader">Loading...</p>}>
        <Header />
      </Suspense>
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
