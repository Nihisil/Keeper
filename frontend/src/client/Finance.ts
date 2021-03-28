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

import {
  Account,
  Currency,
  CurrencyExchangeRateResponseModel,
  Employer,
  FinanceCategory,
  HTTPValidationError,
  Transaction,
} from "./data-contracts";
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
  /**
   * No description
   *
   * @tags currency_exchange_rates
   * @name GetListOfCurrencyExchangeRatesForSpecifiedPair
   * @summary Get List Of Currency Exchange Rates For Specified Pair
   * @request GET:/finance/currency-exchange-rates/get-list
   */
  getListOfCurrencyExchangeRatesForSpecifiedPair = (
    query: { from_currency: Currency; to_currency: Currency; page?: number },
    params: RequestParams = {}
  ) =>
    this.http.request<CurrencyExchangeRateResponseModel, void | HTTPValidationError>({
      path: `/finance/currency-exchange-rates/get-list`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags transactions
   * @name CreateTransaction
   * @summary Create Transaction
   * @request POST:/finance/transactions/create
   */
  createTransaction = (data: Transaction, params: RequestParams = {}) =>
    this.http.request<Transaction, void | HTTPValidationError>({
      path: `/finance/transactions/create`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags transactions
   * @name GetListOfTransactions
   * @summary Get List Of Transactions
   * @request GET:/finance/transactions/get-list
   */
  getListOfTransactions = (params: RequestParams = {}) =>
    this.http.request<Transaction[], void>({
      path: `/finance/transactions/get-list`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags transactions
   * @name DeleteTransaction
   * @summary Delete Transaction
   * @request DELETE:/finance/transactions/delete
   */
  deleteTransaction = (data: Transaction, params: RequestParams = {}) =>
    this.http.request<Account, void | HTTPValidationError>({
      path: `/finance/transactions/delete`,
      method: "DELETE",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags transactions
   * @name UpdateTransaction
   * @summary Update Transaction
   * @request PUT:/finance/transactions/update
   */
  updateTransaction = (data: Transaction, params: RequestParams = {}) =>
    this.http.request<Transaction, void | HTTPValidationError>({
      path: `/finance/transactions/update`,
      method: "PUT",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags finance_categories
   * @name CreateFinanceCategory
   * @summary Create Finance Category
   * @request POST:/finance/categories/create
   */
  createFinanceCategory = (data: FinanceCategory, params: RequestParams = {}) =>
    this.http.request<FinanceCategory, void | HTTPValidationError>({
      path: `/finance/categories/create`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags finance_categories
   * @name GetListOfFinanceCategories
   * @summary Get List Of Finance Categories
   * @request GET:/finance/categories/get-list
   */
  getListOfFinanceCategories = (params: RequestParams = {}) =>
    this.http.request<FinanceCategory[], void>({
      path: `/finance/categories/get-list`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags finance_categories
   * @name DeleteFinanceCategory
   * @summary Delete Finance Category
   * @request DELETE:/finance/categories/delete
   */
  deleteFinanceCategory = (data: FinanceCategory, params: RequestParams = {}) =>
    this.http.request<any, void | HTTPValidationError>({
      path: `/finance/categories/delete`,
      method: "DELETE",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags finance_categories
   * @name UpdateFinanceCategory
   * @summary Update Finance Category
   * @request PUT:/finance/categories/update
   */
  updateFinanceCategory = (data: FinanceCategory, params: RequestParams = {}) =>
    this.http.request<FinanceCategory, void | HTTPValidationError>({
      path: `/finance/categories/update`,
      method: "PUT",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
