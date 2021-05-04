import "components/App/App.scss";

import Footer from "components/App/Footer";
import Header from "components/App/Header";
import Home from "components/App/Home";
import Login from "components/Login/Login";
import React, { Suspense } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useToken } from "utils/token";

const Finances = React.lazy(() => import("components/Finances/Finances"));

export default function App(): JSX.Element {
  const [token, setToken] = useToken();

  let content;
  if (!token) {
    content = <Login setToken={setToken} />;
  } else {
    content = (
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/finances">
          <Suspense fallback={<p>Loading...</p>}>
            <Finances />
          </Suspense>
        </Route>
        <Route render={() => <h2>404 Not found!</h2>} />
      </Switch>
    );
  }

  return (
    <>
      <BrowserRouter>
        <Header setToken={setToken} />
        <main role="main" className="container">
          {content}
        </main>
        <Footer />
      </BrowserRouter>
    </>
  );
}
