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
   * @response `200` `Employer` Successful Response
   * @response `401` `void` Incorrect auth credentials
   * @response `422` `HTTPValidationError` Validation Error
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
   * @response `200` `(Employer)[]` Successful Response
   * @response `401` `void` Incorrect auth credentials
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
   * @request DELETE:/finance/employers/delete/{employer_id}
   * @response `200` `any` Successful Response
   * @response `401` `void` Incorrect auth credentials
   * @response `422` `HTTPValidationError` Validation Error
   */
  deleteEmployer = (employer_id: string, params: RequestParams = {}) =>
    this.http.request<any, void | HTTPValidationError>({
      path: `/finance/employers/delete/${employer_id}`,
      method: "DELETE",
      ...params,
    });
}
