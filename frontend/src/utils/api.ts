/*
 * This module contains glue to work with auto-generated openapi client
 * because of that it is hard to make it properly typed, let's disable warnings for this file.
 * */
/* eslint-disable */
/* tslint:disable */
import { HttpClient } from "client/http-client";
import { getToken } from "utils/token";
import { Users } from "client/Users";
import { Auth } from "client/Auth";
import { Finance } from "client/Finance";

const httpClient = new HttpClient<string>({
  securityWorker: () => {
    const tokenObj = getToken();
    return tokenObj
      ? {
          headers: {
            Authorization: `${tokenObj.token_type} ${tokenObj.access_token}`,
          },
        }
      : {};
  },
  ...{ baseURL: process.env.REACT_APP_API_HOST },
});

const api = {
  http: httpClient,
  users: new Users(httpClient),
  auth: new Auth(httpClient),
  finance: new Finance(httpClient),
};

function wrapPromise(promise: Promise<any>): any {
  let status = "pending";
  let response: any;

  const suspender = promise.then(
    (res) => {
      status = "success";
      response = res;
    },
    (err) => {
      status = "error";
      response = err;
    }
  );

  const read = () => {
    switch (status) {
      case "pending":
        throw suspender;
      case "error":
        throw response;
      default:
        return response;
    }
  };

  return { read };
}

export function fetchData(requestFunction: any): any {
  const promise = requestFunction({ secure: true })
    .then((res: any) => res.data)
    .catch((error: any) => {
      if (error.status === 401) {
        // token was expired
        return null;
      }

      throw error;
    });
  return wrapPromise(promise);
}

export default api;
