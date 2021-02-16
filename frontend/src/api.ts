import { Users } from "client/Users";
import { ContentType, HttpClient } from "client/http-client";
import { Auth } from "client/Auth";

const httpClient = new HttpClient<string>({
  baseUrl: process.env.REACT_APP_API_HOST,
  baseApiParams: {
    headers: {
      "Content-Type": ContentType.Json,
    },
  },
  securityWorker: (token) =>
    token
      ? {
          headers: {
            Authorization: token,
          },
        }
      : {},
});

const api = {
  http: httpClient,
  users: new Users(httpClient),
  auth: new Auth(httpClient),
};

export default api;
