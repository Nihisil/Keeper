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

import { AuthRequest, HTTPValidationError, Token } from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Auth<
  SecurityDataType = unknown
> extends HttpClient<SecurityDataType> {
  /**
   * @description Get user token by username and password
   *
   * @tags auth
   * @name AuthenticateAuthPost
   * @summary Authenticate
   * @request POST:/auth/
   */
  authenticateAuthPost = (data: AuthRequest, params: RequestParams = {}) =>
    this.request<Token, void | HTTPValidationError>({
      path: `/auth/`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
}
