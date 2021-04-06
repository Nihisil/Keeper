import { FinanceCategory, Transaction } from "client/data-contracts";

export function getById<T extends { id?: string }>(collection: Array<T>, itemId: string): T {
  const foundItem = collection.find((item) => item.id === itemId);
  if (!foundItem) {
    throw Error(`Can't find item with id = ${itemId}`);
  }
  return foundItem;
}

export function updateCategoryAmountFromTransaction(
  inputCategory: FinanceCategory,
  transaction: Transaction,
  increase: boolean
): FinanceCategory {
  const category = { ...inputCategory };
  let amount;
  if (transaction.main_currency_exchange_rate) {
    amount = transaction.main_currency_exchange_rate * transaction.amount;
  } else {
    amount = transaction.amount;
  }
  if (!category.amount) {
    category.amount = 0;
  }
  category.amount += increase ? amount : amount * -1;
  return category;
}
