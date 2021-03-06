/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import { User } from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export class Users<SecurityDataType = unknown> {
  constructor(private http: HttpClient<SecurityDataType>) {}

  /**
   * No description
   *
   * @tags users
   * @name GetAuthUserInfo
   * @summary Get Auth User Info
   * @request GET:/users/me/
   */
  getAuthUserInfo = (params: RequestParams = {}) =>
    this.http.request<User, void>({
      path: `/users/me/`,
      method: "GET",
      format: "json",
      ...params,
    });
}
