from typing import List, Optional

import pymongo

from lib.db import db_find_all, db_find_one_by_id, db_insert_one, db_update_one
from lib.finance.finance_categories.models import FinanceCategory


def create_finance_category(finance_category: FinanceCategory) -> FinanceCategory:
    data = db_insert_one(finance_category)
    return data


def get_finance_category_by_id(finance_category_id: str) -> Optional[FinanceCategory]:
    return db_find_one_by_id(FinanceCategory, finance_category_id, {})


def get_finance_categories_list(include_deleted: bool = False) -> List[FinanceCategory]:
    sorting = ["updated", pymongo.DESCENDING]
    data, _ = db_find_all(FinanceCategory, {"is_deleted": include_deleted}, sorting)
    return data


def delete_finance_category(finance_category: FinanceCategory) -> None:
    finance_category.is_deleted = True
    db_update_one(finance_category)
    return None


def update_finance_category(finance_category: FinanceCategory) -> FinanceCategory:
    return db_update_one(finance_category)
