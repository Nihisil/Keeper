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

export class Users<
  SecurityDataType = unknown
> extends HttpClient<SecurityDataType> {
  /**
   * @description Get current user profile information
   *
   * @tags users
   * @name UserInfoUsersMeGet
   * @summary User Info
   * @request GET:/users/me/
   * @response `200` `User` Successful Response
   * @response `401` `void` Incorrect auth credentials
   */
  userInfoUsersMeGet = (params: RequestParams = {}) =>
    this.request<User, void>({
      path: `/users/me/`,
      method: "GET",
      ...params,
    });
}
