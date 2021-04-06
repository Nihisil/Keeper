from datetime import datetime

from fastapi import status
from fastapi.testclient import TestClient

from api.main import app
from lib.finance.accounts.crud import get_account_by_id
from lib.finance.constants import Currency, TransactionType
from lib.finance.transactions.models import Transaction
from lib.tests.utils import (
    create_account_for_tests,
    create_employer_for_tests,
    create_finance_category_for_tests,
    create_transaction_for_tests,
    create_user_and_token_for_tests,
)

client = TestClient(app)


def test_create_transaction_api():
    user, token = create_user_and_token_for_tests()
    account = create_account_for_tests()
    employer = create_employer_for_tests()
    category = create_finance_category_for_tests()
    transaction_data = Transaction(
        type=TransactionType.INCOME,
        amount=100,
        currency=Currency.USD,
        account_id=account.id,
        category_id=category.id,
        from_employer_id=employer.id,
        date=datetime.utcnow(),
        main_currency_exchange_rate=1,
    )
    response = client.post(
        "/finance/transactions/create",
        data=transaction_data.json(),
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == status.HTTP_200_OK
    response_data = response.json()
    assert response_data["id"] is not None
    assert response_data["account"]["id"] == account.id
    assert response_data["category"]["id"] == category.id


def test_get_list_of_transactions_api():
    user, token = create_user_and_token_for_tests()
    number_of_transactions = 4
    for i in range(number_of_transactions):
        create_transaction_for_tests(i + 1)
    response = client.get(
        "/finance/transactions/get-list",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == status.HTTP_200_OK
    response_data = response.json()
    assert len(response_data) == number_of_transactions
    assert response_data[0]["account"]["id"] is not None, "Transaction should include account information"


def test_delete_transaction_api():
    user, token = create_user_and_token_for_tests()
    transaction = create_transaction_for_tests(100)
    response = client.delete(
        "/finance/transactions/delete",
        data=transaction.json(),
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == status.HTTP_200_OK
    response_data = response.json()
    # updated account is present in response
    assert response_data["account"]["id"] == transaction.account_id


def test_update_transaction_api():
    user, token = create_user_and_token_for_tests()

    transaction = create_transaction_for_tests(100)
    account = get_account_by_id(transaction.account_id)
    assert account.balance == transaction.amount

    transaction.amount = 200
    response = client.put(
        "/finance/transactions/update",
        data=transaction.json(),
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == status.HTTP_200_OK
    response_data = response.json()
    assert response_data["account"]["id"] == account.id
    assert response_data["account"]["balance"] == transaction.amount
