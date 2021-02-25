import "components/Login/Login.scss";

import { Token } from "client/data-contracts";
import React, { useState } from "react";
import api from "utils/api";

interface LoginProps {
  setToken(userToken: Token): void;
}

export default function Login({ setToken }: LoginProps): JSX.Element {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    api.auth
      .authenticate({ username, password })
      .then((data) => {
        setToken(data.data);
      })
      .catch((error) => {
        if (error.status === 401) {
          setValidationError("Incorrect login or password.");
        } else {
          throw error;
        }
      });
  };

  let errorBlock = null;
  if (validationError) {
    errorBlock = <p className="text-danger">{validationError}</p>;
  }

  return (
    <>
      <main role="main" className="container">
        <div className="row justify-content-md-center">
          <div className="col-md-5 text-center">
            <form className="login-form" onSubmit={handleSubmit}>
              <h2 className="h3 mb-3 font-weight-normal">Please log in</h2>
              {errorBlock}
              <input
                type="text"
                id="inputUsername"
                className="form-control"
                placeholder="Username"
                required
                onChange={(e) => setUserName(e.target.value)}
              />
              <input
                type="password"
                id="inputPassword"
                className="form-control"
                placeholder="Password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className="btn btn-md btn-primary btn-block"
                type="submit"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
