import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "components/App/App.scss";
import Finances from "components/Finances/Finances";
import Preferences from "components/Preferences/Preferences";
import Login from "components/Login/Login";
import useToken from "components/App/useToken";
import api, { fetchData } from "api";

const resource = fetchData(api.users.getAuthUserInfo);

export default function App(): JSX.Element {
  let user = resource.read();
  if (!user) {
    const [_, setToken] = useToken();
    return <Login setToken={setToken} />;
  }

  return (
    <div className="wrapper">
      <h1>Application {user.username}</h1>
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
