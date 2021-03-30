from typing import List, Optional

import pymongo

from lib.db import db_find_all, db_find_one_by_id, db_insert_one, db_update_one
from lib.finance.constants import TransactionType
from lib.finance.finance_categories.models import FinanceCategory
from lib.finance.transactions.crud import get_transactions_list


def create_finance_category(finance_category: FinanceCategory) -> FinanceCategory:
    data = db_insert_one(finance_category)
    return data


def get_finance_category_by_id(finance_category_id: str) -> Optional[FinanceCategory]:
    return db_find_one_by_id(FinanceCategory, finance_category_id, {})


def get_finance_categories_list(include_deleted: bool = False) -> List[FinanceCategory]:
    sorting = ["updated", pymongo.DESCENDING]
    data, _ = db_find_all(FinanceCategory, {"is_deleted": include_deleted}, sorting)

    # TODO use mongo aggregation here?
    category_ids = [str(x.id) for x in data]
    transactions = get_transactions_list(transaction_type=TransactionType.REGULAR, category_ids=category_ids)
    for category in data:
        related_amount = [x for x in transactions if x.category_id == category.id]
        if not related_amount:
            continue
        category.amount = sum([x.main_currency_equivalent or 0 for x in related_amount])

    return data


def delete_finance_category(finance_category: FinanceCategory) -> FinanceCategory:
    finance_category.is_deleted = True
    return db_update_one(finance_category)


def update_finance_category(finance_category: FinanceCategory) -> FinanceCategory:
    return db_update_one(finance_category)
