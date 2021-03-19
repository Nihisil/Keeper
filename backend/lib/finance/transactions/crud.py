from typing import List, Optional, Tuple

import pymongo

from lib.db import db_delete_one_by_id, db_find_all, db_find_one_by_id, db_insert_one, db_update_one
from lib.finance.accounts.crud import get_account_by_id, update_account
from lib.finance.accounts.models import Account
from lib.finance.constants import MAIN_CURRENCY, MONEY_DIGITS, TransactionType
from lib.finance.currency_exchange_rates.crud import get_currency_exchange_rate_for_nearest_date
from lib.finance.transactions.models import Transaction


def create_transaction(transaction: Transaction) -> Tuple[Transaction, Account]:
    if not transaction.main_currency_equivalent and transaction.currency != MAIN_CURRENCY:
        currency_exchange_rate = get_currency_exchange_rate_for_nearest_date(
            MAIN_CURRENCY, transaction.currency, transaction.date
        )
        assert currency_exchange_rate, f"Can't find currency exchange rate on {transaction.date}"
        transaction.main_currency_equivalent = int(
            (transaction.amount * currency_exchange_rate.rate) * MONEY_DIGITS
        )

    transaction = db_insert_one(transaction)
    account = _update_related_account_balance(transaction.account_id, transaction.amount, increase=True)
    return transaction, account


def get_transaction_by_id(transaction_id: str) -> Optional[Transaction]:
    return db_find_one_by_id(Transaction, transaction_id, {})


def get_transactions_list(
    transaction_type: TransactionType = None, employer_ids: List[str] = None
) -> List[Transaction]:
    sorting = ["updated", pymongo.DESCENDING]

    filter_query: dict = {}

    if transaction_type:
        filter_query["type"] = transaction_type.value

    if employer_ids:
        filter_query["from_employer_id"] = {"$in": employer_ids}

    data, _ = db_find_all(Transaction, filter_query, sorting)
    return data


def delete_transaction(transaction: Transaction) -> None:
    db_delete_one_by_id(Transaction, transaction.id)
    _update_related_account_balance(transaction.account_id, transaction.amount, increase=False)
    return None


def update_transaction(transaction: Transaction, old_amount: int) -> Tuple[Transaction, Account]:
    transaction = db_update_one(transaction)
    account_amount = -old_amount + transaction.amount
    account = _update_related_account_balance(transaction.account_id, account_amount, increase=True)
    return transaction, account


def _update_related_account_balance(account_id: str, amount: int, increase: bool) -> Account:
    account = get_account_by_id(account_id)
    assert account

    if increase:
        account.balance += amount
    else:
        account.balance -= amount

    return update_account(account)
