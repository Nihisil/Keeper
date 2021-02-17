import { Token } from "client/data-contracts";

const TOKEN_KEY = "token";

export const getToken = (): Token | null => {
  const tokenString = localStorage.getItem(TOKEN_KEY);
  if (!tokenString) {
    return null;
  }
  return JSON.parse(tokenString) as Token;
};

export const deleteToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

export const saveToken = (userToken: Token): void => {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(userToken));
};
