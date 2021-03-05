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

export interface Account {
  id?: string;

  /** @format date-time */
  updated?: string;
  name: string;

  /** An enumeration. */
  currency: Currency;

  /** An enumeration. */
  account_type: AccountType;
  is_deleted?: boolean;
}

/**
 * An enumeration.
 */
export enum AccountType {
  BANK = "BANK",
  CASH = "CASH",
  INVESTING = "INVESTING",
  OTHER = "OTHER",
}

export interface AuthRequest {
  username: string;
  password: string;
}

/**
 * An enumeration.
 */
export enum Currency {
  USD = "USD",
  RUB = "RUB",
  EUR = "EUR",
}

export interface Employer {
  id?: string;

  /** @format date-time */
  updated?: string;
  name: string;
  archived?: boolean;
  is_deleted?: boolean;
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

  /** @format date-time */
  updated?: string;
  username: string;
  email: string;
}

export interface ValidationError {
  loc: string[];
  msg: string;
  type: string;
}
