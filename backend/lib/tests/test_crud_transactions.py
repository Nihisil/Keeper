import pytest
from pydantic import ValidationError

from lib.finance.accounts.crud import get_account_by_id
from lib.finance.constants import Currency, TransactionType
from lib.finance.transactions.crud import delete_transaction, get_transactions_list
from lib.finance.transactions.models import Transaction
from lib.tests.utils import create_account_for_tests, create_employer_for_tests, create_transaction_for_tests


def test_create_income_transaction():
    amount = 100
    transaction = create_transaction_for_tests(amount)
    assert transaction.id is not None
    assert transaction.updated is not None
    account = get_account_by_id(transaction.account_id)
    assert account.balance == amount


def test_create_income_transaction_without_employer():
    account = create_account_for_tests()
    with pytest.raises(ValidationError) as e:
        Transaction(
            type=TransactionType.INCOME,
            amount=100,
            currency=Currency.USD,
            account_id=account.id,
        )
    assert "from_employer_id should be set for income transactions" in str(e.value)


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
        )
    assert "account currency didn't match transaction currency" in str(e.value)


def test_get_transactions_list():
    number_of_transactions = 4
    for i in range(number_of_transactions):
        create_transaction_for_tests(i)
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
