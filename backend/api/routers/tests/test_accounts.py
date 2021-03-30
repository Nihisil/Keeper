from fastapi import status
from fastapi.testclient import TestClient

from api.main import app
from lib.finance.accounts.crud import create_account
from lib.finance.accounts.models import Account, AccountType
from lib.finance.constants import Currency
from lib.tests.utils import create_user_and_token_for_tests

client = TestClient(app)


def test_create_account_api():
    user, token = create_user_and_token_for_tests()
    account_data = Account(name="Test", currency=Currency.USD, account_type=AccountType.BANK)
    response = client.post(
        "/finance/accounts/create",
        data=account_data.json(),
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == status.HTTP_200_OK
    response_data = response.json()
    assert response_data["id"] is not None
    assert response_data["name"] == account_data.name


def test_get_list_of_accounts_api():
    user, token = create_user_and_token_for_tests()
    number_of_accounts = 4
    for i in range(number_of_accounts):
        account_data = Account(name=f"Test {i}", currency=Currency.USD, account_type=AccountType.BANK)
        create_account(account_data)
    response = client.get(
        "/finance/accounts/get-list",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == status.HTTP_200_OK
    response_data = response.json()
    assert len(response_data) == number_of_accounts


def test_delete_account_api():
    user, token = create_user_and_token_for_tests()
    account = create_account(Account(name="Test", currency=Currency.USD, account_type=AccountType.BANK))
    response = client.delete(
        "/finance/accounts/delete",
        data=account.json(),
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == status.HTTP_200_OK


def test_update_account_api():
    user, token = create_user_and_token_for_tests()
    account = create_account(Account(name="Test", currency=Currency.USD, account_type=AccountType.BANK))
    new_data = Account(**account.dict())
    new_data.name = "Updated"
    response = client.put(
        "/finance/accounts/update",
        data=new_data.json(),
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == status.HTTP_200_OK
    response_data = response.json()
    assert response_data["name"] == new_data.name
