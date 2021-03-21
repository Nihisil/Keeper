import { Employer } from "client/data-contracts";

export type EmployersAction =
  | { type: "load"; employers: Employer[] }
  | { type: "create"; employer: Employer }
  | { type: "update"; employer: Employer }
  | { type: "delete"; employer: Employer };

export function employersReducer(employers: Employer[], action: EmployersAction): Employer[] {
  switch (action.type) {
    case "load":
      return action.employers;
    case "create":
      return [action.employer, ...employers];
    case "update":
      return employers
        .map((item) => (item.id === action.employer.id ? action.employer : item))
        .sort((a, b) => ((a.updated || 0) > (b.updated || 0) ? -1 : 1));
    case "delete":
      return employers.filter((item) => item.id !== action.employer.id);
    default:
      throw Error("Unknown employers reducer action.");
  }
}
