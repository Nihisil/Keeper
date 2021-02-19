import React from "react";
import { Switch, Route } from "react-router-dom";
import "components/App/App.scss";
import Finances from "components/Finances/Finances";
import Login from "components/Login/Login";
import Header from "components/App/Header";
import Home from "components/App/Home";
import { useToken } from "../../utils/token";

export default function App(): JSX.Element {
  const [token, setToken] = useToken();

  let content;
  if (!token) {
    content = <Login setToken={setToken} />;
  } else {
    content = (
      <Switch>
        <Route path="/finances">
          <Finances />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    );
  }

  return (
    <>
      <Header setToken={setToken} />
      <main role="main" className="container">
        {content}
      </main>
    </>
  );
}
