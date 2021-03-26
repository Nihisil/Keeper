import { FinanceCategory } from "client/data-contracts";

export interface FinanceCategoriesProps {
  financeCategories: Array<FinanceCategory>;
  dispatchFinanceCategories(action: FinanceCategoriesAction): void;
}

export function financeCategoriesReducer(
  financeCategories: FinanceCategory[],
  action: FinanceCategoriesAction
): FinanceCategory[] {
  switch (action.type) {
    case "load":
      return action.financeCategories;
    case "create":
      return [action.financeCategory, ...financeCategories];
    case "update":
      return financeCategories
        .map((item) => (item.id === action.financeCategory.id ? action.financeCategory : item))
        .sort((a, b) => ((a.updated || 0) > (b.updated || 0) ? -1 : 1));
    case "delete":
      return financeCategories.filter((item) => item.id !== action.financeCategory.id);
    default:
      throw Error("Unknown financeCategories reducer action.");
  }
}

export type FinanceCategoriesAction =
  | { type: "load"; financeCategories: FinanceCategory[] }
  | { type: "create"; financeCategory: FinanceCategory }
  | { type: "update"; financeCategory: FinanceCategory }
  | { type: "delete"; financeCategory: FinanceCategory };
