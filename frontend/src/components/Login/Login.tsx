import React, { useState } from "react";
import "components/Login/Login.scss";
import api from "utils/api";
import { saveToken } from "utils/token";

interface LoginProps {}

export default function Login({}: LoginProps): JSX.Element {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    api.auth
      .authenticate({ username, password })
      .then((data) => {
        saveToken(data.data);
        // easiest way to refresh user state is reload whole page
        window.location.href = "/";
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
              <h1 className="h3 mb-3 font-weight-normal">Please log in</h1>
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