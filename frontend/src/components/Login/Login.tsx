import React, { useState } from "react";
import "components/Login/Login.scss";
import api from "api";
import { Token } from "client/data-contracts";

interface LoginProps {
  setToken: (text: Token) => void;
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
        setToken(data.data as Token);
      })
      .catch((error) => {
        if (error.status === 401) {
          setValidationError("Incorrect login or password");
        } else {
          throw error;
        }
      });
  };

  let errorBlock = null;
  if (validationError) {
    errorBlock = <p>{validationError}</p>;
  }

  return (
    <div className="login-wrapper">
      <h1>Please Log In</h1>

      {errorBlock}

      <form onSubmit={handleSubmit}>
        <p>Username</p>
        <input type="text" onChange={(e) => setUserName(e.target.value)} />

        <p>Password</p>
        <input type="password" onChange={(e) => setPassword(e.target.value)} />
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}
