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

import { Employer, HTTPValidationError } from "./data-contracts";
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
      ...params,
    });
}
