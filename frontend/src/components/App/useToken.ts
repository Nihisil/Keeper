import { Token } from "client/data-contracts";
import { useState } from "react";

const TOKEN_KEY = "token";

export const getToken = () => {
  const tokenString = localStorage.getItem(TOKEN_KEY) as string;
  return JSON.parse(tokenString) as Token;
};

export default function useToken(): [Token, (token: Token) => void] {
  const [token, setToken] = useState(getToken());

  const saveToken = (userToken: Token) => {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(userToken));
    setToken(userToken);
  };

  return [token, saveToken];
}
