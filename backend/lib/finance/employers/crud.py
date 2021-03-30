from typing import List, Optional

import pymongo

from lib.db import db_find_all, db_find_one_by_id, db_insert_one, db_update_one
from lib.finance.constants import TransactionType
from lib.finance.employers.models import Employer
from lib.finance.transactions.crud import get_transactions_list


def create_employer(employer: Employer) -> Employer:
    data = db_insert_one(employer)
    return data


def get_employer_by_id(employer_id: str) -> Optional[Employer]:
    return db_find_one_by_id(Employer, employer_id, {})


def get_employers_list(include_deleted: bool = False) -> List[Employer]:
    sorting = ["updated", pymongo.DESCENDING]
    results, _ = db_find_all(Employer, {"is_deleted": include_deleted}, sorting)

    # TODO use mongo aggregation here?
    employer_ids = [str(x.id) for x in results]
    income_data = get_transactions_list(transaction_type=TransactionType.INCOME, employer_ids=employer_ids)
    for employer in results:
        related_income = [x for x in income_data if x.from_employer_id == employer.id]
        if not related_income:
            continue

        income_currency = set([x.currency for x in related_income])
        assert len(income_currency) == 1, "Different currency incomes for one employer are not supported yet"

        employer.earnings = sum([x.amount for x in related_income])
        employer.earnings_currency = income_currency.pop()

    return results


def delete_employer(employer: Employer) -> Employer:
    employer.is_deleted = True
    return db_update_one(employer)


def update_employer(employer: Employer) -> Employer:
    return db_update_one(employer)
