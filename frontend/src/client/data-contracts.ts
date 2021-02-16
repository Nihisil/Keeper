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

export interface AuthRequest {
  username: string;
  password: string;
}

export interface HTTPValidationError {
  detail?: ValidationError[];
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface User {
  id?: string;
  username: string;
  email: string;
}

export interface ValidationError {
  loc: string[];
  msg: string;
  type: string;
}
