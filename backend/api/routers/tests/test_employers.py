from fastapi import status
from fastapi.testclient import TestClient

from api.main import app
from lib.finance.employers.crud import create_employer
from lib.finance.employers.models import Employer
from lib.tests.utils import create_account_for_tests, create_user_and_token_for_tests

client = TestClient(app)


def test_create_employer_api():
    user, token = create_user_and_token_for_tests()
    account = create_account_for_tests()
    employer_data = Employer(name="Test", associated_account_id=account.id)
    response = client.post(
        "/finance/employers/create",
        data=employer_data.json(),
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == status.HTTP_200_OK
    response_data = response.json()
    assert response_data["id"] is not None
    assert response_data["name"] == employer_data.name
    assert response_data["associated_account"]["id"] == account.id


def test_get_list_of_employers_api():
    user, token = create_user_and_token_for_tests()
    account = create_account_for_tests()
    number_of_employers = 4
    for i in range(number_of_employers):
        employer_data = Employer(name=f"Test {i}", associated_account_id=account.id)
        create_employer(employer_data)
    response = client.get(
        "/finance/employers/get-list",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == status.HTTP_200_OK
    response_data = response.json()
    assert len(response_data) == number_of_employers


def test_delete_employer_api():
    user, token = create_user_and_token_for_tests()
    account = create_account_for_tests()
    employer = create_employer(Employer(name="Test", associated_account_id=account.id))
    response = client.delete(
        "/finance/employers/delete",
        data=employer.json(),
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == status.HTTP_200_OK


def test_update_employer_api():
    user, token = create_user_and_token_for_tests()
    account = create_account_for_tests()
    employer = create_employer(Employer(name="Test", associated_account_id=account.id))
    new_data = Employer(**employer.dict())
    new_data.name = "Updated"
    response = client.put(
        "/finance/employers/update",
        data=new_data.json(),
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == status.HTTP_200_OK
    response_data = response.json()
    assert response_data["name"] == new_data.name
