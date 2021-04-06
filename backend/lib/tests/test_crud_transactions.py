from datetime import datetime

import pytest
from pydantic import ValidationError

from lib.finance.accounts.crud import get_account_by_id
from lib.finance.constants import MONEY_DIGITS, Currency, TransactionType
from lib.finance.transactions.crud import (
    create_transaction,
    delete_transaction,
    get_transactions_list,
    update_transaction,
)
from lib.finance.transactions.models import Transaction
from lib.tests.utils import (
    create_account_for_tests,
    create_currency_exchange_rate_for_tests,
    create_employer_for_tests,
    create_transaction_for_tests,
)


def test_create_income_transaction_and_set_main_currency_equivalent():
    rate = 80
    create_currency_exchange_rate_for_tests(rate)

    amount = 100 * MONEY_DIGITS
    account = create_account_for_tests()
    employer = create_employer_for_tests()
    transaction_data = Transaction(
        type=TransactionType.INCOME,
        amount=amount,
        currency=Currency.USD,
        account_id=account.id,
        from_employer_id=employer.id,
        date=datetime.utcnow(),
    )
    transaction = create_transaction(transaction_data)
    assert transaction.id is not None
    assert transaction.updated is not None
    assert transaction.main_currency_exchange_rate is not None
    # it was automatically set
    assert transaction.main_currency_equivalent == rate * amount

    account = get_account_by_id(transaction.account_id)
    assert account.balance == amount


def test_create_income_transaction_with_manually_set_main_currency_equivalent():
    create_currency_exchange_rate_for_tests(80)

    amount = 100
    account = create_account_for_tests()
    employer = create_employer_for_tests()
    transaction_data = Transaction(
        type=TransactionType.INCOME,
        amount=amount,
        currency=Currency.USD,
        account_id=account.id,
        from_employer_id=employer.id,
        date=datetime.utcnow(),
        main_currency_exchange_rate=10,
    )
    transaction = create_transaction(transaction_data)
    assert transaction.id is not None
    assert transaction.updated is not None
    assert transaction.main_currency_exchange_rate is not None
    assert transaction.main_currency_equivalent == 10 * amount

    account = get_account_by_id(transaction.account_id)
    assert account.balance == amount


def test_create_regular_transaction():
    amount = 100
    account = create_account_for_tests()
    employer = create_employer_for_tests()
    transaction_data = Transaction(
        type=TransactionType.REGULAR,
        amount=amount,
        currency=Currency.USD,
        account_id=account.id,
        from_employer_id=employer.id,
        date=datetime.utcnow(),
        main_currency_exchange_rate=10,
    )
    transaction = create_transaction(transaction_data)

    account = get_account_by_id(transaction.account_id)
    # amount was deducted from account
    assert account.balance == amount * -1


def test_create_transaction_with_negative_amount():
    account = create_account_for_tests()
    with pytest.raises(ValidationError) as e:
        Transaction(
            type=TransactionType.INCOME,
            amount=-100,
            currency=Currency.USD,
            account_id=account.id,
            date=datetime.utcnow(),
        )
    assert "amount should be positive value greater than 0" in str(e.value)


def test_create_income_transaction_with_not_matched_currency():
    account = create_account_for_tests(currency=Currency.USD)
    employer = create_employer_for_tests()
    with pytest.raises(ValidationError) as e:
        Transaction(
            type=TransactionType.INCOME,
            amount=100,
            currency=Currency.RUB,
            account_id=account.id,
            from_employer_id=employer.id,
            date=datetime.utcnow(),
        )
    assert "account currency didn't match transaction currency" in str(e.value)


def test_get_transactions_list():
    number_of_transactions = 4
    for i in range(number_of_transactions):
        create_transaction_for_tests(i + 1)
    transactions = get_transactions_list()
    assert len(transactions) == number_of_transactions


def test_delete_transaction():
    amount = 100
    transaction = create_transaction_for_tests(amount)

    account = get_account_by_id(transaction.account_id)
    assert account.balance == amount

    delete_transaction(transaction)
    assert len(get_transactions_list()) == 0

    account = get_account_by_id(transaction.account_id)
    assert account.balance == 0


def test_update_transaction_amount():
    old_amount = 100
    transaction = create_transaction_for_tests(old_amount)
    account = get_account_by_id(transaction.account_id)
    assert account.balance == old_amount

    new_amount = 200
    transaction.amount = new_amount
    update_transaction(transaction, old_amount)
    account = get_account_by_id(transaction.account_id)
    assert account.balance == new_amount
