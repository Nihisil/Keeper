import { Token } from "client/data-contracts";
import { useState } from "react";

const TOKEN_KEY = "token";

export const getToken = (): Token | null => {
  const tokenString = localStorage.getItem(TOKEN_KEY);
  if (!tokenString) {
    return null;
  }
  return JSON.parse(tokenString) as Token;
};

const deleteToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

export function useToken(): [Token | null, (userToken: Token) => void] {
  const [token, setToken] = useState(getToken());

  const saveToken = (userToken: Token) => {
    if (!userToken) {
      deleteToken();
    } else {
      localStorage.setItem(TOKEN_KEY, JSON.stringify(userToken));
    }
    setToken(userToken);
  };

  return [token, saveToken];
}
