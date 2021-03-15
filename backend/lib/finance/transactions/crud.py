from typing import List, Optional

import pymongo

from lib.db import db_delete_one_by_id, db_find_all, db_find_one_by_id, db_insert_one
from lib.finance.accounts.crud import get_account_by_id, update_account
from lib.finance.transactions.models import Transaction


def create_transaction(transaction: Transaction) -> Transaction:
    data = db_insert_one(transaction)
    _update_related_account_balance(transaction, increase=True)
    return data


def get_transaction_by_id(transaction_id: str) -> Optional[Transaction]:
    return db_find_one_by_id(Transaction, transaction_id, {})


def get_transactions_list() -> List[Transaction]:
    sorting = ["updated", pymongo.DESCENDING]
    data, _ = db_find_all(Transaction, {}, sorting)
    return data


def delete_transaction(transaction: Transaction) -> None:
    db_delete_one_by_id(Transaction, transaction.id)
    _update_related_account_balance(transaction, increase=False)
    return None


def _update_related_account_balance(transaction: Transaction, increase: bool) -> None:
    account = get_account_by_id(transaction.account_id)
    assert account

    if increase:
        account.balance += transaction.amount
    else:
        account.balance -= transaction.amount

    update_account(account)

    return None
