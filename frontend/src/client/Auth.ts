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

export class Auth<SecurityDataType = unknown> {
  constructor(private http: HttpClient<SecurityDataType>) {}

  /**
   * @description Get user token by username and password
   *
   * @tags auth
   * @name Authenticate
   * @summary Authenticate
   * @request POST:/auth/
   * @response `200` `Token` Successful Response
   * @response `401` `void` Incorrect auth credentials
   * @response `422` `HTTPValidationError` Validation Error
   */
  authenticate = (data: AuthRequest, params: RequestParams = {}) =>
    this.http.request<Token, void | HTTPValidationError>({
      path: `/auth/`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
}
