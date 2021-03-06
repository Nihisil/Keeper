const MONEY_DIGITS = 100;

/**
 * The server doesn't keep decimal inputs for money records.
 * We need to normalize them before sending from the client (otherwise validation error will rise).
 * @param input
 */
export function convertNumberToMoney(input: number): number {
  return input * MONEY_DIGITS;
}

export function convertMoneyToNumber(input: number): number {
  return input / MONEY_DIGITS;
}

export function displayMoney(input: number): string {
  return convertMoneyToNumber(input).toFixed(2);
}
