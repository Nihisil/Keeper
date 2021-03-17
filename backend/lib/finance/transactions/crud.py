from typing import List, Optional

import pymongo

from lib.db import db_delete_one_by_id, db_find_all, db_find_one_by_id, db_insert_one, db_update_one_by_id
from lib.finance.accounts.crud import get_account_by_id, update_account
from lib.finance.constants import MAIN_CURRENCY, MONEY_DIGITS
from lib.finance.currency_exchange_rates.crud import get_currency_exchange_rate_for_nearest_date
from lib.finance.transactions.models import Transaction


def create_transaction(transaction: Transaction) -> Transaction:
    if not transaction.main_currency_equivalent and transaction.currency != MAIN_CURRENCY:
        currency_exchange_rate = get_currency_exchange_rate_for_nearest_date(
            MAIN_CURRENCY, transaction.currency, transaction.date
        )
        assert currency_exchange_rate, f"Can't find currency exchange rate on {transaction.date}"
        transaction.main_currency_equivalent = int(
            (transaction.amount * currency_exchange_rate.rate) * MONEY_DIGITS
        )

    data = db_insert_one(transaction)
    _update_related_account_balance(transaction.account_id, transaction.amount, increase=True)
    return data


def get_transaction_by_id(transaction_id: str) -> Optional[Transaction]:
    return db_find_one_by_id(Transaction, transaction_id, {})


def get_transactions_list() -> List[Transaction]:
    sorting = ["updated", pymongo.DESCENDING]
    data, _ = db_find_all(Transaction, {}, sorting)
    return data


def delete_transaction(transaction: Transaction) -> None:
    db_delete_one_by_id(Transaction, transaction.id)
    _update_related_account_balance(transaction.account_id, transaction.amount, increase=False)
    return None


def update_transaction(transaction: Transaction, old_amount: int) -> Transaction:
    updated = db_update_one_by_id(Transaction, str(transaction.id), transaction.dict())
    transaction.updated = updated
    account_amount = -old_amount + transaction.amount
    _update_related_account_balance(transaction.account_id, account_amount, increase=True)
    return transaction


def _update_related_account_balance(account_id: str, amount: int, increase: bool) -> None:
    account = get_account_by_id(account_id)
    assert account

    if increase:
        account.balance += amount
    else:
        account.balance -= amount

    update_account(account)

    return None
