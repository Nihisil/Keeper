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
    create_transaction_for_tests,
    create_user_and_token_for_tests,
)

client = TestClient(app)


def test_create_transaction_api():
    user, token = create_user_and_token_for_tests()
    account = create_account_for_tests()
    employer = create_employer_for_tests()
    transaction_data = Transaction(
        type=TransactionType.INCOME,
        amount=100,
        currency=Currency.USD,
        account_id=account.id,
        from_employer_id=employer.id,
        date=datetime.utcnow(),
        main_currency_equivalent=123,
    )
    response = client.post(
        "/finance/transactions/create",
        data=transaction_data.json(),
        headers={"Authorization": f"Bearer {token}"},
    )
    print(response.json())
    assert response.status_code == status.HTTP_200_OK
    response_data = response.json()
    assert response_data["transaction"]["id"] is not None
    assert response_data["account"]["id"] == account.id


def test_get_list_of_transactions_api():
    user, token = create_user_and_token_for_tests()
    number_of_transactions = 4
    for i in range(number_of_transactions):
        create_transaction_for_tests(i)
    response = client.get(
        "/finance/transactions/get-list",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == status.HTTP_200_OK
    response_data = response.json()
    assert len(response_data) == number_of_transactions


def test_delete_transaction_api():
    user, token = create_user_and_token_for_tests()
    transaction, _ = create_transaction_for_tests(100)
    response = client.delete(
        "/finance/transactions/delete",
        data=transaction.json(),
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == status.HTTP_200_OK
    response_data = response.json()
    assert response_data["success"]


def test_update_transaction_api():
    user, token = create_user_and_token_for_tests()

    transaction, _ = create_transaction_for_tests(100)
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
