import { Users } from "client/Users";
import { ContentType, HttpClient } from "client/http-client";
import { Auth } from "client/Auth";
import { getToken } from "components/App/useToken";
import { TPromise } from "client/http-client";

const httpClient = new HttpClient<string>({
  baseUrl: process.env.REACT_APP_API_HOST,
  baseApiParams: {
    headers: {
      "Content-Type": ContentType.Json,
    },
  },
  securityWorker: (token) => {
    const tokenObj = getToken();
    return tokenObj
      ? {
          headers: {
            Authorization: `${tokenObj.token_type} ${tokenObj.access_token}`,
          },
        }
      : {};
  },
});

const api = {
  http: httpClient,
  users: new Users(httpClient),
  auth: new Auth(httpClient),
};

export function fetchData(func: any) {
  const promise = func({ secure: true })
    .then((res: any) => res.data)
    .catch((error: any) => {
      if (error.status === 401) {
        // token was expired
        return null;
      } else {
        throw error;
      }
    });
  return wrapPromise(promise);
}

function wrapPromise(promise: TPromise<any, any>) {
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

export default api;
