from typing import List, Optional

import pymongo

from lib.db import db_find_all, db_find_one_by_id, db_insert_one, db_update_one_by_id
from lib.finance.accounts.models import Account


def create_account(account_data: Account) -> Account:
    data = db_insert_one(account_data)
    return data


def get_account_by_id(account_id: str) -> Optional[Account]:
    return db_find_one_by_id(Account, account_id, {})


def get_accounts_list(include_deleted: bool = False) -> List[Account]:
    sorting = ["updated", pymongo.DESCENDING]
    return db_find_all(Account, {"is_deleted": include_deleted}, sorting)


def delete_account(account: Account) -> None:
    account.is_deleted = True
    db_update_one_by_id(Account, str(account.id), account.dict())
    return None


def update_account(account: Account) -> Account:
    updated = db_update_one_by_id(Account, str(account.id), account.dict())
    account.updated = updated
    return account
