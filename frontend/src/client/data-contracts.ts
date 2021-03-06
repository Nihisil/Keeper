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
  balance?: number;
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
  RUB = "RUB",
  USD = "USD",
  EUR = "EUR",
}

export interface CurrencyExchangeRate {
  id?: string;

  /** @format date-time */
  updated?: string;

  /** An enumeration. */
  from_currency: Currency;

  /** An enumeration. */
  to_currency: Currency;
  rate: number;

  /** @format date-time */
  date: string;
}

export interface CurrencyExchangeRateResponseModel {
  items: CurrencyExchangeRate[];
  page: number;
  per_page: number;
  count: number;
}

export interface Employer {
  id?: string;

  /** @format date-time */
  updated?: string;
  name: string;
  archived?: boolean;
  is_deleted?: boolean;
  associated_account_id: string;
  associated_account?: Account;
  earnings?: number;

  /** An enumeration. */
  earnings_currency?: Currency;
}

export interface FinanceCategory {
  id?: string;

  /** @format date-time */
  updated?: string;
  name: string;
  is_deleted?: boolean;
  amount?: number;
}

export interface HTTPValidationError {
  detail?: ValidationError[];
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface Transaction {
  id?: string;

  /** @format date-time */
  updated?: string;
  amount: number;

  /** @format date-time */
  date: string;
  from_employer_id?: string;
  account_id: string;
  account?: Account;
  category_id?: string;
  category?: FinanceCategory;

  /** An enumeration. */
  type: TransactionType;

  /** An enumeration. */
  currency: Currency;
  main_currency_exchange_rate?: number;
}

/**
 * An enumeration.
 */
export enum TransactionType {
  REGULAR = "REGULAR",
  INCOME = "INCOME",
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
