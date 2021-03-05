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

import { Account, Employer, HTTPValidationError } from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Finance<SecurityDataType = unknown> {
  constructor(private http: HttpClient<SecurityDataType>) {}

  /**
   * No description
   *
   * @tags employers
   * @name CreateEmployer
   * @summary Create Employer
   * @request POST:/finance/employers/create
   */
  createEmployer = (data: Employer, params: RequestParams = {}) =>
    this.http.request<Employer, void | HTTPValidationError>({
      path: `/finance/employers/create`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags employers
   * @name GetListOfEmployers
   * @summary Get List Of Employers
   * @request GET:/finance/employers/get-list
   */
  getListOfEmployers = (params: RequestParams = {}) =>
    this.http.request<Employer[], void>({
      path: `/finance/employers/get-list`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags employers
   * @name DeleteEmployer
   * @summary Delete Employer
   * @request DELETE:/finance/employers/delete
   */
  deleteEmployer = (data: Employer, params: RequestParams = {}) =>
    this.http.request<any, void | HTTPValidationError>({
      path: `/finance/employers/delete`,
      method: "DELETE",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags employers
   * @name UpdateEmployer
   * @summary Update Employer
   * @request PUT:/finance/employers/update
   */
  updateEmployer = (data: Employer, params: RequestParams = {}) =>
    this.http.request<Employer, void | HTTPValidationError>({
      path: `/finance/employers/update`,
      method: "PUT",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags accounts
   * @name CreateAccount
   * @summary Create Account
   * @request POST:/finance/accounts/create
   */
  createAccount = (data: Account, params: RequestParams = {}) =>
    this.http.request<Account, void | HTTPValidationError>({
      path: `/finance/accounts/create`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags accounts
   * @name GetListOfAccounts
   * @summary Get List Of Accounts
   * @request GET:/finance/accounts/get-list
   */
  getListOfAccounts = (params: RequestParams = {}) =>
    this.http.request<Account[], void>({
      path: `/finance/accounts/get-list`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags accounts
   * @name DeleteAccount
   * @summary Delete Account
   * @request DELETE:/finance/accounts/delete
   */
  deleteAccount = (data: Account, params: RequestParams = {}) =>
    this.http.request<any, void | HTTPValidationError>({
      path: `/finance/accounts/delete`,
      method: "DELETE",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags accounts
   * @name UpdateAccount
   * @summary Update Account
   * @request PUT:/finance/accounts/update
   */
  updateAccount = (data: Account, params: RequestParams = {}) =>
    this.http.request<Account, void | HTTPValidationError>({
      path: `/finance/accounts/update`,
      method: "PUT",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
